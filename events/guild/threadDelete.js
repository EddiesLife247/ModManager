const {
    MessageEmbed,
    Message
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require(`../../handlers/functions`);
const { logMessage } = require(`../../handlers/newfunctions`);
const Discord = require(`discord.js`);
module.exports = async (client, thread) => {
    if (client.settings.get(thread.guild.id, "logchannel")) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Modlogs`, thread.guild.iconURL())
            .setColor("#ff0000")
            .setFooter(thread.guild.name, thread.guild.iconURL())
            .setTitle("**Moderation** - Thread Deleted")
            .addField('Name', `> - ${thread.name}`, true)
            .addField('ID', `> - ${thread.id}`, true)
            .addField('Invitable', `> - ${thread.invitable}`, true)
            .addField('Locked', `> - ${thread.locked}`, true)
            .addField('Owner', `> - <@${thread.ownerId}>`, true)
            .addField('Archived', `> - <@${thread.archived}>`, true)
            .setColor('ff0000')
            .setTimestamp();

        thread.guild.channels.cache.find(c => c.id == client.settings.get(thread.guild.id, "logchannel")).send({ embeds: [embed] });
        logMessage(client, "success", thread.guild, "Thread Deleted");
        //client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${message.guild.name} triggered event: MessageDelete Successfully`);
        //console.log(`Found log channel and sent message: ${settings.modLogChannel} in ${message.guild.id}`);
    } else {
        //console.log(`Cannot find channel: ${settings.modLogChannel} in: ${message.guild.name}`);
    }
}