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
        if (client.logchannel.all().length) {
            const logchannel = channel.guild.channels.cache.get(client.logchannel.get().logchannel);
            const guild = channel.guild;
            if(logchannel == null){
                return;
            }
            if (channel.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
                try {
                    //if (channel.me.permissions.has("VIEW_AUDIT_LOG")) {
                    const fetchedLogs = await channel.guild.fetchAuditLogs({
                        limit: 1,
                        type: AuditLogEvent.ChannelDelete,
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
                    //console.log(channel.guild.channels.cache.find(c => c.name == settings.modLogChannel));
                    const embed = new EmbedBuilder();
                    embed.setColor("#ff0000")
                    embed.setTitle('**MODERATION LOG: Channel Deleted**');
                    embed.addFields(
                        { name: 'Channel Name::', value: `${channel.name}`, inline: true },
                        { name: 'Executor', value: `${execute}`, inline: false },
                    )
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
    } catch (err) {
        console.log(err);
        client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
        return;
    }

};