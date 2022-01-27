//===================================

const BLOCKED_WORDS = [
    'test',
    'google',
]

// ===============================================
module.exports = discordClient => {
    const tmi = require('tmi.js');
    const settings = require('./settings.json');
    const BotConfig = require("../botconfig/config.json");
    const SQLite = require("better-sqlite3");
    const BotFilters = require("../botconfig/filters.json");
    const BotEmojis = require("../botconfig/emojis.json");
    const BotEmbed = require("../botconfig/embed.json");
    var Filter = require('bad-words'),
    filter = new Filter();
    // Define configuration options
    const twitchsql = new SQLite(`./databases/twitch.sqlite`);
    const twitchsqldata = twitchsql.prepare("SELECT * FROM twitch").all();

    var channels = "";
    for (const data of twitchsqldata) {
        var twitchchat = data.twitch;
        var channels = channels + twitchchat + ",";
    }
    console.log(channels);
    const opts = {
        connection: {
            reconnect: true
        },
        identity: {
            username: settings.username,
            password: settings.password,
        },
        channels: [
            channels
        ]
    };

    // Create a client with our options
    const client = new tmi.client(opts);

    // Register our event handlers (defined below)
    client.on('connected', onConnectedHandler);

    // Connect to Twitch:
    client.connect();
    client.on('message', (channel, userstate, message, self) => {
        console.log("I saw a message");
        // Ignore echoed messages.
        if (self) return;
        if (message.toLowerCase() === 'hello') {
            // "@alca, heya!"
            client.say(channel, `@${userstate.username}, heya!`);
        } else if (message.toLowerCase() == '!dice') {
            const num = rollDice();
            client.say(channel, `You rolled a ${num}`);
        }else if (message.toLowerCase() == '!discord') {
            client.say(channel, `We are working on this at the moment!`);
        }
        checkTwitchChat(userstate, message, channel)
    });


    function checkTwitchChat(username, message, channel) {
        message = message.toLowerCase();
        let shouldSendMessage = false
        // check message
        shouldSendMessage = BLOCKED_WORDS.some(blockedWord => message.includes(blockedWord.toLowerCase()))
        // None added by Bot Admin now check bad-words filter
        if(shouldSendMessage == false) {
            const forbidenWords = ['shit', 'bollocks', 'twat', 'nigger', 'bastard', 'cunt', '.xxx', 'XX'];
            var customFilter = new Filter({ placeHolder: 'XX' });

              const msg = customFilter.clean(message);
              for (var i = 0; i < forbidenWords.length; i++) {
                shouldSendMessage = msg.includes(forbidenWords[i]);
              }
           
        }
        if (shouldSendMessage) {
            //tell user
            client.say(channel, `@${username.username}, sorry, that message is not permitted here!`)
            //Delete Message
            client.deletemessage(channel, message.identity).then((data) => {
                // data returns
            }).catch((err) => {
                console.log(err);
            })
        }
    }
    // Function called when the "dice" command is issued
    function rollDice() {
        const sides = 6;
        return Math.floor(Math.random() * sides) + 1;
    }

    // Called every time the bot connects to Twitch chat
    function onConnectedHandler(addr, port) {
        console.log(`* Connected to ${addr}:${port}`);
    }
}