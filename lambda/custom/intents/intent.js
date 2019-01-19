class Intent {

    /**
     * Find a player object given its name. Player objects can be used to interact with the player
     *
     * @param squeezeserver The SqueezeServer to get the Player object from
     * @param players A list of players to search
     * @param name The name of the player to find
     * @returns The target player or undefined if it is not found
     */
    static findPlayerObject(squeezeserver, players, name, lastname) {
        const Persist = require("../persist/persist");
        console.log("Looking for play:'" + name + "'");

        if (players) {
            // If we don't have a name try and get it from the database
            if (name !== "") {
                name = name.toLowerCase();
                console.log("In findPlayerObject with " + name);
            } else {
                name = lastname;
            }

            // Look for the player in the players list that matches the given name. Then return the corresponding player object
            // from the squeezeserver stored by the player's id

            // NOTE: For some reason squeezeserver.players[] is empty but you can still reference values in it. I think it
            //       is a weird javascript timing thing
            let player = players.filter(pl => pl.name.toLowerCase() === name.toLowerCase());

            if (player.length == 1) {
                // store the name for future use
                Persist.store(name).then(console.log("Stored name OK")).catch(err => console.log("Stored name failed. %j", err));
                return squeezeserver.players[player[0].playerid];
            } else {
                // If only one player on
                if (players.length == 1) {
                    // store the name for future use
                    Persist.store(players[0].name).then(console.log("Stored name OK")).catch(err => console.log("Stored name failed. %j", err));
                    return squeezeserver.players[players[0].playerid];
                }
            }
        }
        console.log("Player %s not found", name);
    }
}

module.exports = Intent;