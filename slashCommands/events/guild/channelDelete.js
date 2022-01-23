const {
    MessageEmbed,
    Message
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require(`../../handlers/functions`);
const Discord = require(`discord.js`);
module.exports = async (client, channel) => {
    client.settings.ensure(channel.guild.id, {
        prefix: config.prefix,
        defaultvolume: 50,
        defaultautoplay: false,
        defaultfilters: [`bassboost6`, `clear`],
        djroles: [],
        botchannel: [],
        logxhannel: [],
    })
    //console.log(channel);
    // Load the guild's settings
    //console.log(settings.modLogChannel);
    if (client.settings.get(channel.guild.id, "logchannel")) {

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
            if (target.id === channel.id) {
                var execute = executor.tag;
            }
            else {
                var execute = "UNKNOWN";
            }
        }
        else {
            var execute = "UNKNOWN";
        }
        //console.log(channel.guild.channels.cache.find(c => c.name == settings.modLogChannel));
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Modlogs`, channel.guild.iconURL())
            .setColor("#ff0000")
            .setFooter(channel.guild.name, channel.guild.iconURL())
            .addField("**Moderation**", "Channel Deleted")
            .addField("**Channel**", channel.name)
            .addField("**Executor**", execute)
            .setTimestamp();
        if (channel.guild.channels.cache.find(c => c.id == client.settings.get(channel.guild.id, "logchannel"))) {
            channel.guild.channels.cache.find(c => c.id == client.settings.get(channel.guild.id, "logchannel")).send({ embeds: [embed] });
        }
        //console.log(`pin updated in a guild that has logs enabled!`);
    }
    else {
        //console.log(`pin updated in a guild that has logs disabled!`);
        return;
    }
    client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${channel.guild.name} triggered channelDelete: Successfully`);
};