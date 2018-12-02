// Slot info
const albums = require("./album");
const artists = require("./artist");
const genres = require("./genre");
const playlists = require("./playlist");
const titles = require("./title");
const info = {
    Album: albums,
    Artist: artists,
    Genre: genres,
    Playlist: playlists,
    Title: titles
};

function lookupInfo(slot, value) {
    "use strict";
    if (value && value.resolutionsPerAuthority[0].status.code == "ER_SUCCESS_MATCH") {
        return info[slot][value.resolutionsPerAuthority[0].values[0].value.id][1];
    }
}

module.exports = lookupInfo;