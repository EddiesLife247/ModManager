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
    const guild = channel.guild;
    if (channel.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
            try {
                client.logchannel = botsql.prepare(`SELECT settings.settingValue FROM settings WHERE setting = 'logchannel' AND guildid = '${channel.guild.id}'`);
                console.log(`SELECT settings.settingValue FROM settings WHERE setting = 'logchannel' AND guildid = ${channel.guild.id}`);
                console.log(client.logchannel.get());
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
            const logchannel = channel.guild.channels.cache.get(client.logchannel.get().settingValue);
            console.log(logchannel.id);
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
        }
        catch (err) {
            console.log(err);
            return;
        }
    }
} catch (e) {
    console.log(e);
}

};