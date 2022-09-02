const {
    MessageEmbed,
    Message,
    PermissionsBitField,
    AuditLogEvent,
    EmbedBuilder
} = require("discord.js");
const config = require(`../../configs/config.json`);
const Discord = require(`discord.js`);
const SQLite = require("better-sqlite3");
const bansql = new SQLite(`./databases/bans.sqlite`);
const botsql = new SQLite(`./databases/bot.sqlite`);
module.exports = async (client, oldChannel, newChannel) => {
    try {
        client.logchannel = botsql.prepare(`SELECT settings.settingValue FROM settings WHERE setting = 'logchannel' AND guildid = '${oldChannel.guild.id}'`);
        const logchannel = oldChannel.guild.channels.cache.get(client.logchannel.get().settingValue);
        if (!logchannel.id == "") {
            const guild = oldChannel.guild;
            if (oldChannel.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
                try {
                    //if (channel.me.permissions.has("VIEW_AUDIT_LOG")) {
                    const fetchedLogs = await oldChannel.guild.fetchAuditLogs({
                        limit: 1,
                        type: AuditLogEvent.ChannelUpdate,
                    });
                    const chLog = fetchedLogs.entries.first();
                    if (Date.now() - chLog.createdTimestamp < 5000) {
                        if (!chLog) {
                            var execute = "UNKNOWN";
                        }
                        const { executor, target } = chLog;
                        var execute = executor.tag;
                    }
                    else {
                        var execute = "UNKNOWN";
                    }
                    const embed = new EmbedBuilder();
                    embed.setColor("#0000ff")
                    embed.setTitle('**MODERATION LOG: Channel Updated**');
                    embed.addFields(
                        { name: 'Old Channel Name:', value: `${oldChannel.name}`, inline: true },
                        { name: 'New Channel Name:', value: `${newChannel.name}`, inline: true },
                        { name: '\u200B', value: '\u200B', inline: true },
                        { name: 'Old Channel NSFW:', value: `${oldChannel.nsfw}`, inline: true },
                        { name: 'New Channel NSFW:', value: `${newChannel.nsfw}`, inline: true },
                        { name: '\u200B', value: '\u200B', inline: true },
                        { name: 'Old Category ID:', value: `<#${oldChannel.parentId}>`, inline: true },
                        { name: 'New Category ID:', value: `<#${newChannel.parentId}>`, inline: true },
                        { name: '\u200B', value: '\u200B', inline: true },
                        { name: 'Old Slow Mode Status:', value: `${oldChannel.rateLimitPerUser}`, inline: true },
                        { name: 'New Slow Mode Status', value: `${newChannel.rateLimitPerUser}`, inline: true },
                        { name: '\u200B', value: '\u200B', inline: true },
                        { name: 'Old Topic:', value: `${oldChannel.topic}`, inline: true },
                        { name: 'New Topic', value: `${newChannel.topic}`, inline: true },
                        { name: '\u200B', value: '\u200B', inline: true },

                        { name: 'Executor', value: `${execute}`, inline: false },
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
    } catch (e) {
        console.log(e);
    }

};