function lookupInfo(slot, value) {
    "use strict";
    if (value && value.resolutionsPerAuthority[0].status.code == "ER_SUCCESS_MATCH") {
        const result = value.resolutionsPerAuthority[0].values[0].value.id;

        // Replace % with spaces
        return result.replace(/%/g, ' ');
    }
}

module.exports = lookupInfo;