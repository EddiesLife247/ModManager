const { EmbedBuilder, Collection, PermissionsBitField, AuditLogEvent } = require('discord.js')
const ms = require('ms');
const config = require('../../configs/config.json');
const SQLite = require("better-sqlite3");
const e = require('express');
var Filter = require('bad-words'),
    filter = new Filter();
const cooldown = new Collection();
const scoresql = new SQLite(`./databases/scores.sqlite`);
const bansql = new SQLite(`./databases/bans.sqlite`);
const botsql = new SQLite(`./databases/bot.sqlite`);
module.exports = async (client, message) => {
    try {
        
        client.setup = botsql.prepare(`SELECT * FROM settings WHERE guildid = '${message.guild.id}'`);
        if (!client.setup.all().length) {
            //console.log(`${message.guild.name} - Is not setup!`);
            return;
        }
        client.logchannel = botsql.prepare(`SELECT logchannel FROM settings WHERE guildid = '${message.guild.id}'`);
        if (client.logchannel.get().logchannel) {
            const logchannel = message.guild.channels.cache.get(client.logchannel.get().logchannel);
            const guild = message.guild;
            if(logchannel == null){
                return;
            }
            if (message.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
                // LOGS HERE
                try {
                    const fetchedLogs = await message.guild.fetchAuditLogs({
                        limit: 1,
                        type: AuditLogEvent.MessageDelete,
                    });
                    const chLog = fetchedLogs.entries.first();
                    //console.log(chLog);
                    if (Date.now() - chLog.createdTimestamp < 5000) {
                        if (!chLog) {
                            var execute = "UNKNOWN";
                            var author = target.id;
                        } else {
                            const { executor, target } = chLog;
                            var execute = executor.username;
                            //console.log(target);
                            author = target.username;
                        }

                    }
                    else {
                        var execute = "UNKNOWN";
                        var author;
                        if(message.author) {
                            author = message.author.id;
                        } else {
                            author = "UNKNOWN";
                        }
                    }
                    
                    if(message.content == null) {
                        msgcnt = "UNKNOWN - Due to not being cached.";
                    } else {
                        msgcnt = message.content;
                    }

                    const embed = new EmbedBuilder();
                    embed.setColor("#ff0000")
                    embed.setTitle('**MODERATION LOG: Message Deleted**');
                    embed.addFields(
                        { name: 'Channel:', value: `<#${message.channel.id}>`, inline: true },
                        { name: 'Author:', value: `<@${author}>`, inline: true },
                        { name: 'Pinned status', value: `>${message.pinned}`, inline: true },
                        { name: 'Message was tts?', value: `>${message.tts}`, inline: true },
                        { name: 'Message ID?', value: `>${message.id}`, inline: true },
                        { name: 'Deleted by:', value: `>${execute}`, inline: true },
                        { name: 'Message Content:', value: `>${msgcnt}`, inline: false },

                    )
                    embed.setURL(`https://discord.com/channels/${message.guild.id}/${message.channel.id}`)

                    embed.setTimestamp();

                    logchannel.send({ embeds: [embed] });
                    //console.log(`pin updated in a guild that has logs enabled!`);
                    //}
                } catch (err) {
                    console.log(err);
                    client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
                    return;
                }

            }
        }
        console.log(`Message Deleted in: ${message.guild.name} : ${message.channel.name}.`);

    } catch (err) {
        console.log(err);
        client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
        return;
    }

};
