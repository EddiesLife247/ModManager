const { EmbedBuilder, Collection, PermissionsBitField, AuditLogEvent } = require('discord.js')
const ms = require('ms');
const config = require('../../configs/config.json');
const SQLite = require("better-sqlite3");
var Filter = require('bad-words'),
	filter = new Filter();
const cooldown = new Collection();
const scoresql = new SQLite(`./databases/scores.sqlite`);
const bansql = new SQLite(`./databases/bans.sqlite`);
const botsql = new SQLite(`./databases/bot.sqlite`);
module.exports = async (client, message) => {
	try {
		
        client.logchannel = botsql.prepare(`SELECT logchannel FROM settings WHERE guildid = '${message.guild.id}'`);
        if (client.logchannel.get().logchannel) {
            const logchannel = message.guild.channels.cache.get(client.logchannel.get().logchannel);
			const guild = message.guild;
            if (message.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
				// LOGS HERE
				try {
                    const fetchedLogs = await message.guild.fetchAuditLogs({
                        limit: 1,
                        type: AuditLogEvent.MessageDelete,
                    });
                    const chLog = fetchedLogs.entries.first();
					console.log(chLog);
                    if (Date.now() - chLog.createdTimestamp < 5000) {
                        if (!chLog) {
                            var execute = "UNKNOWN";
                        }
                        const { executor, target } = chLog;
                        var execute = executor.username;
						var author = target.ClientUser.id;
                    }
                    else {
                        var execute = "UNKNOWN";
						var author = "UNKNOWN";
                    }
                    const embed = new EmbedBuilder();
                    embed.setColor("#00ff00")
                    embed.setTitle('**MODERATION LOG: Message Deleted**');
                    embed.addFields(
						{ name: 'Channel:', value: `<#${message.channel.name}>`, inline: true },
						{ name: 'Author:', value: `<#${author}>`, inline: true },
						{ name: 'Deleted by:', value: `${execute}`, inline: false },
                    )
                    embed.setTimestamp();

                    logchannel.send({ embeds: [embed] });
                    //console.log(`pin updated in a guild that has logs enabled!`);
                    //}
                }
                catch (err) {
                    console.log(err);
                    return;
                }
				
			}
		}

	} catch (error) {
		console.log(error);
	}

};