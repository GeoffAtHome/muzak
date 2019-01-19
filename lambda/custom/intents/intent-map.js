const SqueezeServer = require("squeezenode-lordpengwin");
const config = require("../config.js");
const Utils = require("../utils.js");
const Persist = require("../persist/persist.js");

const Intent = require("./intent.js");
const ChangeVolume = require("./changevolume.js");
const Help = require("./help.js");
const Name = require("./name.js");
const NextTrack = require("./nexttrack.js");
const Pause = require("./pause.js");
const PlayPlaylist = require("./play-playlist.js");
const PreviousTrack = require("./previoustrack.js");
const Randomize = require("./randomize.js");
const Repeat = require("./repeat.js");
const Resume = require("./resume.js");
const Select = require("./select.js");
const SetVolume = require("./setvolume.js");
const Start = require("./start.js");
const StartShuffle = require("./startshuffle.js");
const Stop = require("./stop.js");
const StopShuffle = require("./stopshuffle.js");
const Sync = require("./sync.js");
const Unsync = require("./unsync.js");
const WhatsPlaying = require("./whatsplaying.js");

class IntentMap {
    /**
     * Called when the user specifies an intent for this skill.
     *
     * @param eventRequest The full request
     * @param session The current session
     * @param callback A callback used to return results
     */

    static onIntent(eventRequest, session, callback) {
        "use strict";
        console.log("onIntent requestId=" + eventRequest.requestId + ", sessionId=" + session.sessionId);

        // Check for Audio directives
        if (eventRequest.type !== "AudioPlayer.PlaybackStopped") {

            // Check for a Close intent
            switch (eventRequest.intent.intentName) {
                case "Close":
                    closeInteractiveSession(callback);
                    return;

                case "AMAZON.HelpIntent":
                    Help(session, callback);
                    return;

                default:
                    break;
            }
        }

        // Connect to the squeeze server and wait for it to finish its registration
        var squeezeserver = new SqueezeServer(config.squeezeserverURL, config.squeezeserverPort, config.squeezeServerUsername, config.squeezeServerPassword);
        squeezeserver.on("register", function () {


            // Get the list of players as any request will require them
            squeezeserver.getPlayers(function (reply) {
                if (reply.ok) {
                    console.log("getPlayers: %j", reply);
                    // We will get the persisted player name before dispatching the intent as all these intents required the player name
                    console.log("Calling Persits.retrive");
                    Persist.retrieve().then(result => IntentMap.dispatchIntent(squeezeserver, reply.result, eventRequest, session, result.Items[0].Value.S, callback)).catch(err => IntentMap.dispatchIntent(squeezeserver, reply.result, eventRequest, session, "", callback));
                } else {
                    callback(session.attributes, Utils.buildSpeechResponse("Get Players", "Failed to get list of players", null, true, "Error", null));
                }
            });
        });
    }

    /**
     * Identify the intent and dispatch it to the target static
     *
     * @param squeezeserver The handler to the SqueezeServer
     * @param players A list of players on the server
     * @param intent The target intent
     * @param session The current session
     * @param callback The callback to use to return the result
     */

    static dispatchIntent(squeezeserver, players, eventRequest, session, lastname, callback) {
        "use strict";
        var intentName = "AMAZON.StopIntent";
        if (eventRequest.type !== "AudioPlayer.PlaybackStopped") {
            intentName = eventRequest.intent.name;
        }

        console.log("Lastname: " + lastname);
        console.log("Got intent: %j", intentName);
        console.log("Session is %j", session);
        switch (intentName) {
            case "SyncPlayers":
                Sync(squeezeserver, players, eventRequest.intent, session, lastname, callback);
                break;

            case "NamePlayers":
                Name(players, session, callback);
                break;

            default:
                this.dispatchSecondaryIntent(squeezeserver, players, eventRequest, session, lastname, callback);
                break;
        }
    }

    static dispatchSecondaryIntent(squeezeserver, players, eventRequest, session, lastname, callback) {
        "use strict";
        var intent = eventRequest.intent;
        var intentName = "AMAZON.StopIntent";
        if (eventRequest.type !== "AudioPlayer.PlaybackStopped") {
            intentName = intent.name;
        }

        // We are going to get the name from intent.slots.Player.resolutions.resolutionsPerAuthority[0].values[0].value.name
        var name = (
            (typeof intent.slots !== "undefined") &&
            (typeof intent.slots.Player !== "undefined") &&
            (typeof intent.slots.Player.resolutions !== "undefined") &&
            (typeof intent.slots.Player.resolutions.resolutionsPerAuthority !== "undefined") &&
            (typeof intent.slots.Player.resolutions.resolutionsPerAuthority[0].values !== "undefined") &&
            (typeof intent.slots.Player.resolutions.resolutionsPerAuthority[0].values[0].value !== "undefined") &&
            (typeof intent.slots.Player.resolutions.resolutionsPerAuthority[0].values[0].value.name !== null) ? intent.slots.Player.resolutions.resolutionsPerAuthority[0].values[0].value.name :
            (typeof session.attributes !== "undefined" ? session.attributes.player : ""));

        // Try to find the target player
        var player = Intent.findPlayerObject(squeezeserver, players, name, lastname);
        if (player === null || player === undefined) {

            // Couldn't find the player, return an error response
            console.log("Player not found: " + name);
            callback(session.attributes, Utils.buildSpeechResponse(intentName, "Player not found", null, session.new, "error", null));

        } else {

            var playOnAlexa = config.alexaplayers.indexOf(player) != -1;
            console.log("Player is " + player);
            session.attributes = {
                player: player.name,
                playonalexa: playOnAlexa
            };

            // Call the target intent
            switch (intentName) {
                case "AMAZON.PauseIntent":
                    Pause(player, session, callback);
                    break;

                case "AMAZON.ResumeIntent":
                    Resume(player, session, callback);
                    break;

                case "AMAZON.StopIntent":
                case "AMAZON.CancelIntent":
                    Stop(player, session, callback);
                    break;

                case "AMAZON.LoopOffIntent":
                    Repeat(player, false, session, callback);
                    break;

                case "AMAZON.RepeatIntent":
                    return;

                case "AMAZON.LoopOnIntent":
                    Repeat(player, true, session, callback);
                    break;

                case "AMAZON.NextIntent":
                    NextTrack(player, session, callback);
                    break;

                case "AMAZON.StartOverIntent":
                case "AMAZON.PreviousIntent":
                    PreviousTrack(player, session, callback);
                    break;

                case "AMAZON.ShuffleOffIntent":
                    StopShuffle(player, session, callback);
                    break;

                case "AMAZON.ShuffleOnIntent":
                    StartShuffle(player, session, callback);
                    break;

                case "StartPlayer":
                    Start(player, session, callback);
                    break;

                case "PlayPlaylist":
                    PlayPlaylist(player, intent, session, callback);
                    break;

                case "RandomizePlayer":
                    Randomize(player, session, callback);
                    break;

                case "PreviousTrack":
                    PreviousTrack(player, session, callback);
                    break;

                case "NextTrack":
                    NextTrack(player, session, callback);
                    break;

                case "UnsyncPlayer":
                    Unsync(player, session, callback);
                    break;

                case "SetVolume":
                    SetVolume(player, Number(intent.slots.Volume.value), session, callback);
                    break;

                case "IncreaseVolume":
                    ChangeVolume(player, session, callback, 10);
                    break;

                case "DecreaseVolume":
                    ChangeVolume(player, session, callback, -10);
                    break;

                case "WhatsPlaying":
                    WhatsPlaying(player, session, callback);
                    break;

                case "SelectPlayer":
                    Select(player, session, callback);
                    break;

                default:
                    callback(session.attributes, Utils.buildSpeechResponse("Invalid Request", intentName + " is not a valid request", null, session.new, "error", player));
                    throw " intent";
            }
        }
    }
}

module.exports = IntentMap;