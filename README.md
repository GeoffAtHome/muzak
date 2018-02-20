Squeezebox
==========

Squeezebox is a skill for the Amazon Echo that provides control over a Logitech (Squeezebox) Media Server.

How To Use
----------

### Configuration:

* Copy the provided `config.js-sample` file and enter the required values to allow the skill to connect to your squeezebox server. Update the players array with the name of your Squeezebox players. Save as `config.js`.
* This should include the URL and credentials for your Logitech Media Server and the App ID of the Alexa skill created above
* Change directory to lambda/custom and run `npm install` to download npm dependencies.
* Switch back to the root directory and run `create.cmd` to produce models/{locale}.json, lambda/custom/info and to create the Dynamo database to persist player name across sessions.


### Publish the Skill

#### With ask-cli
* See https://www.youtube.com/watch?v=13-tCdh8Y_E&feature=youtu.be for details of ask-cli
* Run `ask init` to setup you account credentials
* Set up `.ask\config` for your `skill_id` and `endpoint/uri`
* Run `ask deploy` to publish the skill and Lambda functions

### Commands:

* Start Player
  Starts the named player using the last played song or playlist
* Stop Player
  Stops the named player
* Set Volume
  Sets the volume of the named player to the given level between 0 and 100
* Increase/decrease volume
  Increases or decreases the volume of the named player by 10
* Sync Players
  Syncs the first named player to the second
* Unsync Player
  Unsyncs the named player
* Whats Playing
  Returns information about the current song playing on the named player
* Name My Players
  Return a list of all the player names in your network
* Randomize Player
  Starts the named player using a random song
* Previous Track
  Plays the previous track using the named player
* Next Track
  Plays the next track using the named player
* Help
  List all the commands that can be said

### Interactive Mode:

An interactive mode is supported where multiple commands may be issued in one session. The target player is remembered between requests so that it does not have to be specified. e.g.

* "Alexa open squeezebox"
* "select player1"
* "play"
* "set volume to 25"
* "exit"


Credits
-------
* This skill uses an enhanced version of Piotr Raczynski's squeezenode Node.JS module. It has been modified to support basic HTTP authentication as well as some additional functionality
