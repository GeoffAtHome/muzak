/**
 * Alexa Skills Kit program to expose the SqueezeServer to Alexa
 *
 */

//  Integration with the squeeze server

const tunnel = require("tunnel-ssh");
const SqueezeServer = require("squeezenode-lordpengwin");
const Utils = require("./utils");
const Dispatcher = require("./dispatcher");

// Configuration
const config = require("./config.js");
var server = require('./ssh-tunnel')(config);

/**
 * Route the incoming request based on type (LaunchRequest, IntentRequest,
 * etc.) The JSON body of the request is provided in the event parameter.
 *
 * @param event
 * @param context
 */
exports.handler = function (event, context) {
    try {

        console.log("Event is %j", event);

        // If this is a new session makesure we can talk to LMS otherise just give up.
        if (event && event.session && event.session.new) {
            Dispatcher.onSessionStarted({
                requestId: event.request.requestId
            }, event.session);
        }

        // What have we been asked to do?
        switch (event.request.type) {

            case "LaunchRequest":
                Dispatcher.onLaunch(event.request,
                    event.session,
                    function callback(sessionAttributes, speechResponse) {
                        context.succeed(Utils.buildResponse(sessionAttributes, speechResponse));
                    });
                break;


            case "IntentRequest":
                Dispatcher.onIntent(event.request,
                    event.session,
                    function callback(sessionAttributes, speechResponse) {
                        context.succeed(Utils.buildResponse(sessionAttributes, speechResponse));
                    });
                break;

            case "SessionEndedRequest":
                Dispatcher.onSessionEnded(event.request, event.session);
                context.succeed();
                break;

            case "AudioPlayer.PlaybackStarted":
            case "AudioPlayer.PlaybackFinished":
            case "AudioPlayer.PlaybackStopped":
            case "AudioPlayer.PlaybackNearlyFinished":
            case "AudioPlayer.PlaybackFailed":
                context.succeed(Utils.buildAudioResponse(event.request.type));
                break;

            default:
                console.log("Unknow event request type: " + event.request.type);
                return true;
        }
    } catch (e) {
        console.log("Caught exception %j", e);
        context.fail("Exception: " + e);
    }
};