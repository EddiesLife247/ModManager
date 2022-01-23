const {
    MessageEmbed,
    Message
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require(`../../handlers/functions`);
const Discord = require(`discord.js`);
module.exports = async (client, oldGuild, newGuild) => {
    try {
        if (client.settings.get(newGuild.id, "logchannel")) {
            //console.log(channel.guild.channels.cache.find(c => c.name == settings.modLogChannel));
            const embed = new Discord.MessageEmbed()
                .setAuthor(`Modlogs`, oldGuild.iconURL())
                .setColor("#0000ff")
                .setFooter(oldGuild.name, oldGuild.iconURL())
                .setTitle("**Moderation** - Guild Updated Info")
                .addField("**Name Was**", `${oldGuild.name}`, true)
                .addField("**Name Now**", `${newGuild.name}`, true)
                .addField("**NSFW Was**", `${oldGuild.nsfwLevel}`, true)
                .addField("**NSFW Now**", `${newGuild.nsfwLevel}`, true)
                .addField("**Premium Tier Was**", `${oldGuild.premiumTier}`, true)
                .addField("**Premium Tier Now**", `${newGuild.premiumTier}`, true)
                .setTimestamp();
            newGuild.channels.cache.find(c => c.id == client.settings.get(newGuild.id, "logchannel")).send({ embeds: [embed] });
            client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n  ${newGuild.name} triggered guildUpdate: (name was: ${oldGuild.name}) Successfully`);
        }
    } catch (err) {
        //do nothing
    }
};
