const Utils = require("../utils");
const Intent = require("./intent");

class Stop extends Intent {
    /**
     * Stop a player
     *
     * @param player The player to stop
     * @param session The current session
     * @param callback The callback to use to return the result
     */
    static stop(player, session, callback) {
        "use strict";
        try {
            console.log("In stop with player %s", player.name);
            callback(session.attributes, Utils.buildSpeechResponse("Stop", "OK", null, true));
        } catch (ex) {
            console.log("Caught exception in stopPlayer %j", ex);
            callback(session.attributes, Utils.buildSpeechResponse("Stop Player", "Caught Exception", null, true));
        }
    }
}

module.exports = Stop.stop;