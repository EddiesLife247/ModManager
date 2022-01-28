//===================================

const BLOCKED_WORDS = [
    'test',
    'google',
]


// ===============================================
module.exports = async (discordClient) => {
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const tmi = require('tmi.js');
    const settings = require('./settings.json');
    const BotConfig = require("../botconfig/config.json");
    const SQLite = require("better-sqlite3");
    const BotFilters = require("../botconfig/filters.json");
    const BotEmojis = require("../botconfig/emojis.json");
    const BotEmbed = require("../botconfig/embed.json");
    const cron = require('node-cron');
    var Filter = require('bad-words'),
        filter = new Filter();
    // Define configuration options
    const opts = {
        connection: {
            reconnect: true
        },
        identity: {
            username: settings.username,
            password: settings.password,
        },
        channels: [
            "modmanagerbot",
            "manumission247",
        ]
};

// Create a client with our options
const client = new tmi.client(opts);
const twitchsql = new SQLite(`./databases/twitch.sqlite`);
const twitchsqldata = twitchsql.prepare("SELECT * FROM twitch").all();
for (const data of twitchsqldata) {
    var twitchchat = data.twitch;
    client.join(twitchchat).then((data) => {
        client.say(channel, `I am now moderating this channel`);
    }).catch((err) => {
        client.log.warn(`Join Error ${err}`);
    });
}

// Register our event handlers (defined below)
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();
client.on('join', (channel, username, self) => {
    if (self) {
        client.log.warn(`Joined ${channel}`);
    }
});
client.on("part", (channel, username, self) => {
    // Do your stuff.
    client.log.warn(`Left ${channel}`);
});
client.on("slowmode", (channel, enabled, length) => {
    // Do your stuff.
    client.say(channel, `Channel SLOW MODE: ${enabled}`);
});
client.on('message', (channel, userstate, message, self) => {
    // Ignore echoed messages.
    if (self) return;
    if (message.toLowerCase() === 'hello') {
        // "@alca, heya!"
        client.say(channel, `@${userstate.username}, heya!`);
    } else if (message.toLowerCase() == '!dice') {
        const num = rollDice();
        client.say(channel, `You rolled a ${num}`);
    } else if (message.toLowerCase() == '!discord') {
        const twitchsqldata = twitchsql.prepare(`SELECT * FROM twitch WHERE twitch = ${channel} `).all();
for (const data of twitchsqldata) {
    var discord = data.discord;
        const guild = discordClient.guilds.get(discord);
        let memberCount = guild.memberCount;
        client.say(channel, `We are working on this at the moment! But there are ${memberCount} users on the discord.`);
}
    }

    else if (message.toLowerCase() == '!join') {
        for (const data of twitchsqldata) {
            var twitchchat = data.twitch;
            client.join(twitchchat);
            console.log(`joined: ${twitchchat}`);
            client.say(channel, `I have joined all known channels.`)
        }
    }
    
    checkTwitchChat(userstate, message, channel)
});


function checkTwitchChat(userstate, message, channel) {
    message = message.toLowerCase();
    let shouldSendMessage = false
    // check message
    shouldSendMessage = BLOCKED_WORDS.some(blockedWord => message.includes(blockedWord.toLowerCase()))
    // None added by Bot Admin now check bad-words filter
    if (shouldSendMessage == false) {
        
        const forbidenWords = ['shit', 'bollocks', 'twat', 'nigger', 'bastard', 'cunt', '.xxx', 'XX'];
        var customFilter = new Filter({ placeHolder: 'XX' });

        const msg = customFilter.clean(message);
        for (var i = 0; i < forbidenWords.length; i++) {
            shouldSendMessage = msg.includes(forbidenWords[i]);
        }

    }
    if (shouldSendMessage) {
        //tell user
        client.say(channel, `@${userstate.username}, sorry, that message is not permitted here!`)
        //Delete Message
        client.deletemessage(channel, userstate.id).then((data) => {
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
    // Now conntected Join known channels
    for (const data of twitchsqldata) {
        var twitchchat = data.twitch;
        client.join(twitchchat);
        console.log(`joined: ${twitchchat}`);
    }
}
}