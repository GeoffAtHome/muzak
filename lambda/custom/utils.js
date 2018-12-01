const config = require("./config.js");

const rePromptText = "What do you want me to do";

class Utils {
    /**
     * Format a response to send to the Echo
     *
     * @param title The title for the UI Card
     * @param output The speech output
     * @param repromptText The prompt for more information
     * @param shouldEndSession A flag to end the session
     * @param intentCall intent of call
     * @param player player in use or null
     * @returns A formatted JSON object containing the response
     */
    static buildSpeechResponse(title, output, textToSpeak, shouldEndSession, intentCall, player) {
        let repromptText = rePromptText;
        if (textToSpeak !== null) {
            repromptText = textToSpeak;
        }
        let response = {
            outputSpeech: {
                type: "PlainText",
                text: output
            },

            card: {
                type: "Simple",
                title: "Squeezebox Server - " + title,
                content: "Squeezebox Server - " + output
            },

            reprompt: {
                outputSpeech: {
                    type: "PlainText",
                    text: repromptText
                }
            },
            shouldEndSession: shouldEndSession
        };

        switch (intentCall) {
            case "start":
                response.directives = [{
                    "type": "AudioPlayer.ClearQueue",

                    "clearBehavior": "CLEAR_ALL"
                }];
                break;
            case "close":
                break;
            case "changeVolume":
                break;
            case "error":
                break;
            case "nameplayers":
                break;
            case "nexttrack":
                break;
            case "previoustrack":
                break;
            case "randomplay":
                break;
            case "resume":
                break;
            case "selectplayer":
                break;
            case "setvolume":
                break;
            case "play":
                response.directives = [{
                    "type": "AudioPlayer.Play",

                    "playBehavior": "REPLACE_ALL",
                    "audioItem": {
                        "stream": {
                            "token": "token1553",
                            "url": "https://music.soord.org.uk/stream.mp3",
                            "offsetInMilliseconds": 0
                        }
                    },
                    "metadata": {
                        "title": title,
                        "subtitle": output
                        /*
                        "art": {
                          "sources": [
                            {
                              "url": "https://url-of-the-album-art-image.png"
                            }
                          ]
                        },
                        "backgroundImage": {
                          "sources": [
                            {
                              "url": "https://url-of-the-background-image.png"
                            }
                          ]
                        } */
                    }
                }];

                break;
            case "pause":
                response.directives = [{
                    "type": "AudioPlayer.Stop"
                }]
                break;
            case "stop":
                response.directives = [{
                    "type": "AudioPlayer.Stop"
                }]
                break;
            case "shuffle":
                break;
            case "stopshuffle":
                break;
            case "synced":
                break;
            case "unsync":
                break;
            case "whatsplaying":
                break;
            default:
                console.log("Unknown intentcall %s", intentCall)
                break;
        }
        console.log(response);

        return response;
    }

    /**
     * Return the response
     *
     * @param sessionAttributes The attributes for the current session
     * @param speechResponse The response object
     * @returns A formatted object for the response
     */

    static buildResponse(sessionAttributes, speechResponse) {
        return {
            version: "1.0",
            sessionAttributes: sessionAttributes,
            response: speechResponse
        };
    }

    /**
     * Return the response
     *
     * @param sessionAttributes The attributes for the current session
     * @returns A formatted object for the response
     */

    static buildAudioResponse(eventRequestType) {
        var response = {
            version: "1.0",
            response: {}
        };

        console.log(eventRequestType);

        switch (eventRequestType) {
            case "AudioPlayer.PlaybackStarted":
                response.directives = [{
                    "type": "AudioPlayer.Play",

                    "playBehavior": "REPLACE_ALL",
                    "audioItem": {
                        "stream": {
                            "token": "token1553",
                            "url": config.streamURL,
                            "offsetInMilliseconds": 0
                        }
                    }
                }];
                break;

            case "AudioPlayer.PlaybackFinished":
                response.directives = [{
                    "type": "AudioPlayer.Stop"
                }];
                break;

            case "AudioPlayer.PlaybackStopped":
                response.directives = [{
                    "type": "AudioPlayer.Stop"
                }];
                break;

            case "AudioPlayer.PlaybackNearlyFinished":
                response.directives = [{
                    "type": "AudioPlayer.Play",

                    "playBehavior": "REPLACE_ALL",
                    "audioItem": {
                        "stream": {
                            "token": "token1553",
                            "url": "https://music.soord.org.uk/stream.mp3",
                            "offsetInMilliseconds": 0
                        }
                    }
                }];
                break;

            case "AudioPlayer.PlaybackFailed":
                response.directives = [{
                    "type": "AudioPlayer.Stop"
                }];
                break;

        }
        console.log(response);

        return response;
    }

}

module.exports = Utils;