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
module.exports = async (client, oldEmoji, newEmoji) => {
    try {
    client.features.ensure(emoji.guild.id, {
        music: true,
        logs: true,
        reactionroles: true,
        moderation: true,
        fun: true,
        youtube: false,
        support: true,
        points: true,
    });
    if (client.features.get(emoji.guild.id, "logs") == false) {
        return;
    }
    const guild = oldEmoji.guild;
    if (guild.me.permissions.has("VIEW_AUDIT_LOG")) {
        client.settings.ensure(oldEmoji.guild.id, {
            prefix: config.prefix,
            defaultvolume: 50,
            defaultautoplay: false,
            defaultfilters: [`bassboost6`, `clear`],
            djroles: [],
            botchannel: [],
            logxhannel: [],
        })
        // Load the guild's settings
        if (newEmoji.guild.channels.cache.find(c => c.id == client.settings.get(newEmoji.guild.id, "logchannel"))) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`Modlogs`, newEmoji.guild.iconURL())
                .setColor("#ff0000")
                .setFooter(newEmoji.guild.name, newEmoji.guild.iconURL())
                .setTitle("**Moderation** - Emoji Updated")
                .addField('Name Was', `> - :${oldEmoji.name}:`, true)
                .addField('Name Now', `> - :${newEmoji.name}:`, true)
                .addField('Created by', `> - ${oldEmoji.author}`, true)
                .addField('Identifier', `> - :${oldEmoji.identifier}:`)
                .setColor('0000FF')
                .setTimestamp();

            newEmoji.guild.channels.cache.find(c => c.id == client.settings.get(newEmoji.guild.id, "logchannel")).send({ embeds: [embed] });
            logMessage(client, "success", emoji.guild, "Emoji Update Log Message");
            //client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${message.guild.name} triggered event: MessageDelete Successfully`);
            //console.log(`Found log channel and sent message: ${settings.modLogChannel} in ${message.guild.id}`);
        } else {
            logMessage(client, "Logs Disabled", emoji.guild, "Emoji Update Log Message");
            //console.log(`Cannot find channel: ${settings.modLogChannel} in: ${message.guild.name}`);
        }
    }
} catch (e) {
    const { logMessage } = require(`../../handlers/newfunctions`);
    logMessage(client, `error`, emoji.guild, `Error with EMOJI UPDATE event: ${e.message} | \`\`\` ${e.stack} \`\`\``);
}

};