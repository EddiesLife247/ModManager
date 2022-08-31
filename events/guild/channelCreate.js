const {
    MessageEmbed,
    Message
} = require("discord.js");
const config = require(`../../configs/config.json`);
const Discord = require(`discord.js`);
module.exports = async (client, channel) => {
    try {
    const guild = channel.guild;
    if (guild.me.permissions.has("VIEW_AUDIT_LOG")) {
        if (client.settings.get(channel.guild.id, "logchannel")) {
            //if (channel.me.permissions.has("VIEW_AUDIT_LOG")) {
            const fetchedLogs = await channel.guild.fetchAuditLogs({
                limit: 1,
                type: 'CHANNEL_CREATE',
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
            const embed = new Discord.MessageEmbed()
                .setAuthor(`Modlogs`, channel.guild.iconURL())
                .setColor("#00ff00")
                .setFooter(channel.guild.name, channel.guild.iconURL())
                .addField("**Moderation**", "Channel Created")
                .addField("**Channel**", channel.name)
                .addField("**Executor**", execute)
                .setTimestamp();
            if (channel.guild.channels.cache.find(c => c.id == client.settings.get(channel.guild.id, "logchannel"))) {
                channel.guild.channels.cache.find(c => c.id == client.settings.get(channel.guild.id, "logchannel")).send({ embeds: [embed] });
                logMessage(client, "success", channel.guild, "Channel Created Log Message");
            }
            //console.log(`pin updated in a guild that has logs enabled!`);
            //}
        }
        else {
            logMessage(client, "Logs Disabled", channel.guild, "Channel Created Log Message");

            //console.log(`pin updated in a guild that has logs disabled!`);
            return;
        }
    }
} catch (e) {
    const { logMessage } = require(`../handlers/newfunctions`);
    logMessage(client, `error`, channel.guild, `Error with CHANNEL CREATE event: ${e.message} | \`\`\` ${e.stack} \`\`\``);
}

};