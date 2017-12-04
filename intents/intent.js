const Persist = require("../persist/persist");

class Intent {

    /**
     * Find a player object given its name. Player objects can be used to interact with the player
     *
     * @param squeezeserver The SqueezeServer to get the Player object from
     * @param players A list of players to search
     * @param name The name of the player to find
     * @returns The target player or undefined if it is not found
     */
    static findPlayerObject(squeezeserver, players, name) {

        if (players) {
            // If we don't have a name try and get it from the database
            if (name != "") {
                name = this.normalizePlayer(name);
                console.log("In findPlayerObject with " + name);

                // Look for the player in the players list that matches the given name. Then return the corresponding player object
                // from the squeezeserver stored by the player's id

                // NOTE: For some reason squeezeserver.players[] is empty but you can still reference values in it. I think it
                //       is a weird javascript timing thing
            } else {
                Persist.retrieve().then(result => findPlayer(squeezeserver, players, results));
            }
        }
        console.log("Player %s not found", name);
    }

    static findPlayer(squeezeserver, players, name) {
        if (players) {
            let player = players.filter(pl => pl.name.toLowerCase() === name);
            if (player.length == 1) {
                // store the name for future use
                Persist.store(name);
                return squeezeserver.players[player[0].playerid];
            }
        }
        console.log("Player %s not found", name);
    }

    /**
     * Do any necessary clean up of player names
     *
     * @param playerName The name of the player to clean up
     * @returns The normalized player name
     */

    static normalizePlayer(playerName) {

        // protect against `playerName` being undefined
        if (!playerName) {
            playerName = '';
        }


        // After the switch to custom slots multi name players like living room became living-room. Revert the string back to what it was

        playerName = playerName.replace("-", " ");
        if (playerName.toLowerCase() == "livingroom")
            playerName = "living room";

        return playerName;
    }

}

module.exports = Intent;