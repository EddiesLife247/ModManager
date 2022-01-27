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
    try {
    client.features.ensure(thread.guild.id, {
        music: true,
        logs: true,
        reactionroles: true,
        moderation: true,
        fun: true,
        youtube: false,
        support: true,
        points: true,
    });
    if (client.features.get(thread.guild.id, "logs") == false) {
        return;
    }
    if (thread.joinable) {
        try {
            await thread.join();
        } catch (e) {
            console.log(e)
            logMessage(client, "error", thread.guild, `Error at line 17: ${e} (threadCreate)`);
        }
    }


    if (client.settings.get(thread.guild.id, "logchannel")) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Modlogs`, thread.guild.iconURL())
            .setColor("#ff0000")
            .setFooter(thread.guild.name, thread.guild.iconURL())
            .setTitle("**Moderation** - Thread Created")
            .addField('Name', `> - ${thread.name}`, true)
            .addField('ID', `> - ${thread.id}`, true)
            .addField('Invitable', `> - ${thread.invitable}`, true)
            .addField('Locked', `> - ${thread.locked}`, true)
            .addField('Owner', `> - <@${thread.ownerId}>`, true)
            .addField('Archived', `> - <@${thread.archived}>`, true)
            .setColor('00ff00')
            .setTimestamp();

        thread.guild.channels.cache.find(c => c.id == client.settings.get(thread.guild.id, "logchannel")).send({ embeds: [embed] });
        logMessage(client, "success", thread.guild, "Thread Created");
        //client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${message.guild.name} triggered event: MessageDelete Successfully`);
        //console.log(`Found log channel and sent message: ${settings.modLogChannel} in ${message.guild.id}`);
    } else {
        //console.log(`Cannot find channel: ${settings.modLogChannel} in: ${message.guild.name}`);
    }
} catch (e) {
    const { logMessage } = require(`../../handlers/newfunctions`);
    logMessage(client, `error`, thread.guild, `Error with THREAD CREATE event: ${e.message} | \`\`\` ${e.stack} \`\`\``);
}
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
