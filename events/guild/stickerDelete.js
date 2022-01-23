const {
    MessageEmbed,
    Message
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require(`../../handlers/functions`);
const Discord = require(`discord.js`);
module.exports = async (client, sticker) => {
    client.settings.ensure(sticker.guild.id, {
        prefix: config.prefix,
        defaultvolume: 50,
        defaultautoplay: false,
        defaultfilters: [`bassboost6`, `clear`],
        djroles: [],
        botchannel: [],
        logxhannel: [],
    })
    // Load the guild's settings
    if (client.settings.get(sticker.guild.id, "logchannel")) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Modlogs`, sticker.guild.iconURL())
            .setColor("#ff0000")
            .setFooter(sticker.guild.name, sticker.guild.iconURL())
            .setTitle("**Moderation** - Sticker Deleted")
            .addField('Name', `> - ${sticker.name}`, true)
            .setColor('ff0000')
            .setTimestamp();

        sticker.guild.channels.cache.find(c => c.id == client.settings.get(sticker.guild.id, "logchannel")).send({ embeds: [embed] });
        client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${sticker.guild.name} triggered event: StickerDelete Successfully`);
        //client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${message.guild.name} triggered event: MessageDelete Successfully`);
        //console.log(`Found log channel and sent message: ${settings.modLogChannel} in ${message.guild.id}`);
    } else {
        //console.log(`Cannot find channel: ${settings.modLogChannel} in: ${message.guild.name}`);
    }


};