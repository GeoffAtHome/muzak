copy .\config.js .\lambda\custom\
node ./create-assets/create-assets.js
node ./lambda/custom/persist/delete-database.js
node ./lambda/custom/persist/create-database.js
