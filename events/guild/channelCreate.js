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
module.exports = async (client, channel) => {
    try {
        client.logchannel = botsql.prepare(`SELECT logchannel FROM settings WHERE guildid = '${channel.guild.id}'`);
        if (!client.logchannel.all().length == null) {
            const logchannel = channel.guild.channels.cache.get(client.logchannel.get().logchannel);

            const guild = channel.guild;
            if (channel.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
                try {
                    const fetchedLogs = await channel.guild.fetchAuditLogs({
                        limit: 1,
                        type: AuditLogEvent.ChannelCreate,
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
                    embed.setColor("#00ff00")
                    embed.setTitle('**MODERATION LOG: Channel Created**');
                    embed.addFields(
                        { name: 'Channel Name::', value: `${channel.name}`, inline: true },
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