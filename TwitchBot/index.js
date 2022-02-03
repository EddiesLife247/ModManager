const BotConfig = require("../botconfig/config.json");
const SQLite = require("better-sqlite3");
const settings = require('./settings.json');
const tmi = require('tmi.js');
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
const client = new tmi.client(opts);
const twitchsql = new SQLite(`./databases/twitch.sqlite`);
//===================================
module.exports = async (discordClient) => {
    function logMessage(message) {
        console.log(`**TWITCH BOT:** ${message}`);
        discordClient.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`**TWITCH BOT:** ${message}`);
    }
    try {
        const delay = ms => new Promise(res => setTimeout(res, ms));
        const cron = require('node-cron');
        var prefix = "?";
        var Filter = require('bad-words'),
            filter = new Filter();
        // Define configuration options

        // Define configuration options
        client.on("ping", () => {
            logMessage(`Ping from twitch`);
        });
        client.on("pong", (latency) => {
            logMessage(`Pong from Twitch: ${latency}`)
        });
        client.on("join", (channel, username, self) => {
            if(self === true) {
                // self bot.
                const badges = username.badges || {};
                const isBroadcaster = badges.broadcaster;
                const isMod = badges.moderator;
                const isVIP = badges.vip;
                const isVIPUp = isBroadcaster || isMod || isVIP;
                if(isMod) {
                    client.say(channel, `I am now moderating this channel!`);
                } else {
                    client.say(channel, `Moderator commands will not work, as I am not a mod on this channel. please do /mod modmanagerbot`);
                }
            }
        });
        client.on('message', (channel, userstate, message, self) => {
            var chan = channel.substring(1);
            const twitchchannel = twitchsql.prepare("SELECT * FROM twitch WHERE twitch = ?").all(chan);
            var twitchdata = "";
            for (const data of twitchchannel) {
                if (data == undefined) {
                    twitchdata = "";
                    TwitchFilter = true;
                    twitchbot = true;
                } else {
                    discord = data.guild;
                    const guild = discordClient.guilds.cache.get(discord);
                    discordClient.features.ensure(discord, {
                        music: true,
                        logs: true,
                        reactionroles: true,
                        moderation: true,
                        fun: true,
                        youtube: false,
                        support: true,
                        points: true,
                        TwitchFilter: true,
                        twitchbot: true,
                        twitchlurk: "",
                    });
                    if (discordClient.features.get(discord, "twitchbot") == true) {
                        // Ignore echoed messages.
                        //if (self) return;

                        if (message.toLowerCase() === 'hello') {
                            logMessage(`Channel : ${channel} : hello comamnd`);
                            // "@alca, heya!"
                            client.say(channel, `@${userstate.username}, heya!`);
                        } else if (message.toLowerCase() == '!lurk') {
                            client.say(channel, `${userstate.username} is now lurking!, ${discordClient.features.get(discord, "twitchlurk")}`)
                        } else if (message.toLowerCase() == '!unlurk') {
                            client.say(channel, `${userstate.username} has now returned!`)
                            return;
                        }
                        else if (message.toLowerCase() == '?join') {
                            for (const data of twitchsqldata) {
                                var twitchchat = data.twitch;
                                client.join(twitchchat);
                                logMessage(`joined: ${twitchchat}`);
                                return;
                            }
                            client.say(channel, `I have joined all known channels.`)
                            logMessage(`Channel : ${channel} : join comamnd`);
                        } else if (message.toLowerCase() == '?discord') {
                            let memberCount = guild.memberCount;
                            if (data.invite) {
                                invite = `https://discord.gg/${data.invite}`;
                            } else {
                                invite = `Our discord is INVITE only, sorry :(.`;
                                memberCount = 'unknwon';
                            }

                            client.say(channel, `Come join the discord at: ${invite} We have ${memberCount} users on our discord.`);
                            logMessage(`Channel : ${channel} : discord comamnd`);
                            return;
                        } else {
                            if (discordClient.features.get(discord, "TwitchFilter") == false) {
                            } else {
                                const badges = userstate.badges || {};
                                const isBroadcaster = badges.broadcaster;
                                const isMod = badges.moderator;
                                const isVIP = badges.vip;
                                const isVIPUp = isBroadcaster || isMod || isVIP;
                                if (isVIPUp) {
                                    if (userstate.username == "skymay4") {
                                        checkTwitchChat(userstate, message, channel)
                                    } else {
                                        logMessage(`${channel} - checking twitch chat, but user is a mod`)
                                    }
                                } else {
                                    checkTwitchChat(userstate, message, channel)
                                }
                            }
                            const args = message.slice(prefix.length).trim().split(/ +/g);
                            const cmd = args.shift().toLowerCase();
                            if (message.startsWith("?")) {
                                logMessage(`Command Prefix used:?: ${cmd}`);
                                try {
                                    let commandFile = require(`./commands/${cmd}.js`);
                                    if (commandFile) {
                                        commandFile.run(client, channel, userstate, message, self, args, discordClient)
                                        logMessage(`Channel : ${channel} : ${cmd} comamnd. - ${message}`);
                                    }
                                } catch (err) {
                                    return logMessage(`An error occured: ${err} with command: ${cmd} - ${message}`);
                                }
                            }
                            const twitchcmdssql = new SQLite(`./databases/twitchcmds.sqlite`);
                            var chan = channel.substring(1);
                            const twitchcmds = twitchcmdssql.prepare("SELECT * FROM twitchcmds WHERE twitch = ?").all(chan);
                            var twitchdata = "";
                            for (const data of twitchcmds) {
                                if (data == undefined) {
                                    // do nothing no voice
                                } else {
                                    if (cmd == data.cmd) {
                                        channel.say(data.value);
                                        logMessage(`${channel} run custom command: ${data.cmd} with message sent: ${data.value}`);
                                    }
                                }
                            }

                        }

                    }
                }
            }
        });

        // Register our event handlers (defined below)
        client.on('connected', onConnectedHandler);

        client.on('disconnected', (reason) => {
            logMessage(`Disconnected from twitch: ${reason}`);
            client.connect();
        });

        // Connect to Twitch:
        client.connect();
        client.on("slowmode", (channel, enabled, length) => {
            var chan = channel.substring(1);
            const twitchchannel = twitchsql.prepare("SELECT * FROM twitch WHERE twitch = ?").all(chan);
            var twitchdata = "";
            for (const data of twitchchannel) {
                if (data == undefined) {
                    twitchdata = "";
                } else {
                    discord = data.guild;
                    discordClient.features.ensure(discord, {
                        music: true,
                        logs: true,
                        reactionroles: true,
                        moderation: true,
                        fun: true,
                        youtube: false,
                        support: true,
                        points: true,
                        TwitchFilter: true,
                        twitchbot: true,
                    });
                }
                if (discordClient.features.get(discord, "twitchbot") == true) {
                    // Do your stuff.
                    var status = ""
                    if (enabled == true) {
                        status = `ON you must wait ${length} between each message`;
                    } else {
                        status = "OFF";
                    }
                    client.say(channel, `Channel SLOW MODE has been turned: ${status}`);
                    logMessage(`Channel : ${channel} : SLOW MODE has been turned: ${status}`);
                } else {
                    return logMessage(`Twitch Bot Disabled for ${channel} - Slow mode`);
                }
            }
        });
        client.on("reconnect", () => {
            logMessage(`Reconnecting to Twitch!`);
        });
        client.on("resub", (channel, username, months, message, userstate, methods) => {
            var chan = channel.substring(1);
            const twitchchannel = twitchsql.prepare("SELECT * FROM twitch WHERE twitch = ?").all(chan);
            var twitchdata = "";
            for (const data of twitchchannel) {
                if (data == undefined) {
                    twitchdata = "";
                } else {
                    discord = data.guild;
                    discordClient.features.ensure(discord, {
                        music: true,
                        logs: true,
                        reactionroles: true,
                        moderation: true,
                        fun: true,
                        youtube: false,
                        support: true,
                        points: true,
                        TwitchFilter: true,
                        twitchbot: true,
                    });
                }
                if (discordClient.features.get(discord, "twitchbot") == true) {
                    // Do your stuff.
                    let cumulativeMonths = ~~userstate["msg-param-cumulative-months"];
                    client.say(channel, `${username} has re-subscribed for ${months} months via ${methods}. They have been subbed for ${cumulativeMonths} months!`);
                    logMessage(`Channel : ${channel} : ${username} has re-subscribed for ${months} months via ${methods}. They have been subbed for ${cumulativeMonths} months!`);
                } else {
                    return logMessage(`Twitch Bot Disabled for ${channel} - Resub`);
                }
            }
        });
        client.on("cheer", (channel, userstate, message) => {
            var chan = channel.substring(1);
            const twitchchannel = twitchsql.prepare("SELECT * FROM twitch WHERE twitch = ?").all(chan);
            var twitchdata = "";
            for (const data of twitchchannel) {
                if (data == undefined) {
                    twitchdata = "";
                } else {
                    discord = data.guild;
                    discordClient.features.ensure(discord, {
                        music: true,
                        logs: true,
                        reactionroles: true,
                        moderation: true,
                        fun: true,
                        youtube: false,
                        support: true,
                        points: true,
                        TwitchFilter: true,
                        twitchbot: true,
                    });
                }
                if (discordClient.features.get(discord, "twitchbot") == true) {
                    client.say(channel, `${userstate.username} Thank you for the cheer!`);
                    logMessage(`Channel : ${channel} : ${userstate.username} has cheered`);
                } else {
                    return logMessage(`Twitch Bot Disabled for ${channel} - Cheer`);
                }
            }
        });
        client.on("anongiftpaidupgrade", (channel, username, userstate) => {
            var chan = channel.substring(1);
            const twitchchannel = twitchsql.prepare("SELECT * FROM twitch WHERE twitch = ?").all(chan);
            var twitchdata = "";
            for (const data of twitchchannel) {
                if (data == undefined) {
                    twitchdata = "";
                } else {
                    discord = data.guild;
                    discordClient.features.ensure(discord, {
                        music: true,
                        logs: true,
                        reactionroles: true,
                        moderation: true,
                        fun: true,
                        youtube: false,
                        support: true,
                        points: true,
                        TwitchFilter: true,
                        twitchbot: true,
                    });
                }
                if (discordClient.features.get(discord, "twitchbot") == true) {
                    client.say(channel, `${username} has continued the sub from an anonymous gifter! Thank you so much!`);
                    logMessage(`Channel : ${channel} : ${username} has continued the sub from an anonymous gifter! Thank you so much!`);
                } else {
                    return logMessage(`Twitch Bot Disabled for ${channel} - Anonymous Sub Upgrade`);
                }
            }
        });
        client.on("ban", (channel, username, reason, userstate) => {

            // Do your stuff.
            var chan = channel.substring(1);
            const twitchchannel = twitchsql.prepare("SELECT * FROM twitch WHERE twitch = ?").all(chan);
            var twitchdata = "";
            for (const data of twitchchannel) {
                if (data == undefined) {
                    twitchdata = "";
                } else {
                    discord = data.guild;
                    discordClient.features.ensure(discord, {
                        music: true,
                        logs: true,
                        reactionroles: true,
                        moderation: true,
                        fun: true,
                        youtube: false,
                        support: true,
                        points: true,
                        TwitchFilter: true,
                        twitchbot: true,
                    });
                }
                if (discordClient.features.get(discord, "twitchbot") == true) {
                    client.say(channel, 'We are adding this to our punishment database!');
                } else {
                    return logMessage(`Twitch Bot Disabled for ${channel} - Ban Added`);
                }
            }
        });
        client.on("clearchat", (channel) => {
            var chan = channel.substring(1);
            const twitchchannel = twitchsql.prepare("SELECT * FROM twitch WHERE twitch = ?").all(chan);
            var twitchdata = "";
            for (const data of twitchchannel) {
                if (data == undefined) {
                    twitchdata = "";
                } else {
                    discord = data.guild;
                    discordClient.features.ensure(discord, {
                        music: true,
                        logs: true,
                        reactionroles: true,
                        moderation: true,
                        fun: true,
                        youtube: false,
                        support: true,
                        points: true,
                        TwitchFilter: true,
                        twitchbot: true,
                    });
                }
                if (discordClient.features.get(discord, "twitchbot") == true) {
                    client.say(channel, `The channel chat has been cleared`);
                } else {
                    return logMessage(`Twitch Bot Disabled for ${channel} - Clear Chat`);
                }
            }
        });
        client.on("followersonly", (channel, enabled, length) => {
            var chan = channel.substring(1);
            const twitchchannel = twitchsql.prepare("SELECT * FROM twitch WHERE twitch = ?").all(chan);
            var twitchdata = "";
            for (const data of twitchchannel) {
                if (data == undefined) {
                    twitchdata = "";
                } else {
                    discord = data.guild;
                    discordClient.features.ensure(discord, {
                        music: true,
                        logs: true,
                        reactionroles: true,
                        moderation: true,
                        fun: true,
                        youtube: false,
                        support: true,
                        points: true,
                        TwitchFilter: true,
                        twitchbot: true,
                    });
                }
                if (discordClient.features.get(discord, "twitchbot") == true) {
                    var status = ""
                    if (enabled == true) {
                        status = `ON you must be following for ${length} before talking in this chat room.`;
                    } else {
                        status = "OFF";
                    }
                    client.say(channel, `The channel chat follow only mode has been turned: ${status}`);
                    logMessage(`Channel : ${channel} : FOLLOW MODE has been turned: ${status}`);
                } else {
                    return logMessage(`Twitch Bot Disabled for ${channel} - Folow only mode`);
                }
            }
        });
        client.on("subscribers", (channel, enabled) => {
            var chan = channel.substring(1);
            const twitchchannel = twitchsql.prepare("SELECT * FROM twitch WHERE twitch = ?").all(chan);
            var twitchdata = "";
            for (const data of twitchchannel) {
                if (data == undefined) {
                    twitchdata = "";
                } else {
                    discord = data.guild;
                    discordClient.features.ensure(discord, {
                        music: true,
                        logs: true,
                        reactionroles: true,
                        moderation: true,
                        fun: true,
                        youtube: false,
                        support: true,
                        points: true,
                        TwitchFilter: true,
                        twitchbot: true,
                    });
                }
                if (discordClient.features.get(discord, "twitchbot") == true) {
                    // Do your stuff.
                    var status = ""
                    if (enabled == true) {
                        status = `ON you must be a subscriber to talk in the chat.`;
                    } else {
                        status = "OFF, everyone can chat, please abide by the channel rules";
                    }
                    client.say(channel, `Channel SUB MODE has been turned: ${status}`);
                    logMessage(`Channel : ${channel} : SUB MODE has been turned: ${status}`);
                } else {
                    return logMessage(`Twitch Bot Disabled for ${channel} - Sub Only`);
                }
            }
        });
        client.on("raided", (channel, username, viewers) => {
            var chan = channel.substring(1);
            const twitchchannel = twitchsql.prepare("SELECT * FROM twitch WHERE twitch = ?").all(chan);
            var twitchdata = "";
            for (const data of twitchchannel) {
                if (data == undefined) {
                    twitchdata = "";
                } else {
                    discord = data.guild;
                    discordClient.features.ensure(discord, {
                        music: true,
                        logs: true,
                        reactionroles: true,
                        moderation: true,
                        fun: true,
                        youtube: false,
                        support: true,
                        points: true,
                        TwitchFilter: true,
                        twitchbot: true,
                    });
                }
                if (discordClient.features.get(discord, "twitchbot") == true) {
                    client.say(channel, `Thank you ${username} for the raid with ${viewers}! HYPE!!!`);
                    logMessage(`Channel : ${channel} :${username} RAIDED`);
                } else {
                    return console.log(`Twitch Bot Disabled for ${channel}`);
                }
            }
        });

        // Function called when the "dice" command is issued
        function rollDice() {
            const sides = 6;
            return Math.floor(Math.random() * sides) + 1;
        }

        // Called every time the bot connects to Twitch chat
        function onConnectedHandler(addr, port) {
            try {
                console.log(`* Connected to ${addr}:${port}`);
                logMessage(`Connected to Twitch!`);
                // Now conntected Join known channels
                const twitchsqldata = twitchsql.prepare("SELECT * FROM twitch").all();
                for (const data of twitchsqldata) {
                    client.join(data.twitch);
                    logMessage(`Joined: ${data.twitch}`);
                }
                /** MANUAL JOINS */
                client.join('demonwalker909');
                logMessage(`Joined: demonwalker909 (MANUAL)`);
                client.join('darkwytchcraft');
                logMessage(`Joined: darkwytchcraft (MANUAL)`);
                client.join('elementaladept');
                logMessage(`Joined: elementaladept (MANUAL)`);
            } catch (err) {
                logMessage(`Start Bot Error: ${err}`);
            }
        }
        function checkTwitchChat(userstate, message, channel) {
            message = message.toLowerCase();
            let shouldSendMessage = false
            // None added by Bot Admin now check bad-words filter
            if (shouldSendMessage == false) {

                const forbidenWords = ['XX'];
                var customFilter = new Filter({ placeHolder: 'XX' });

                const msg = customFilter.clean(message);
                for (var i = 0; i < forbidenWords.length; i++) {
                    shouldSendMessage = msg.includes(forbidenWords[i]);
                }

            }
            if (shouldSendMessage) {
                //tell user
                client.say(channel, `@${userstate.username}, sorry, that message is not permitted here!`)
                logMessage(`Channel : ${channel} : message blocked`);
                //Delete Message
                client.deletemessage(channel, userstate.id).then((data) => {
                    // data returns
                }).catch((err) => {
                    console.log(err);
                })
            }
        }
    } catch (err) {
        logMessage(`**ERROR** : \`\`\`${err}\`\`\``);
    }
}
// ===============================================
module.exports.joinChannel = joinChannel;
module.exports.connect = connect;
function joinChannel(channel) {
    try {
        client.join(channel);
        console.log(`Joined; ${channel}`);
    } catch (e) {
        console.log(e);
    }
};
function connect() {
    try {
        client.connect();
    } catch (e) {
        console.log(e);

    }
}