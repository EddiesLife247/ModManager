const {
    MessageEmbed,
    Message
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require(`../../handlers/functions`);
const { logMessage } = require(`../../handlers/newfunctions`);
module.exports = async (client, oldUser, newUser) => {
    //console.log(message);
    //console.log(`pin updated in ${channel.guild.id}`);
    //console.log(settings.modLogChannel);
    /*
    if (client.settings.get(newUser.guild.id, "logchannel")) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Modlogs`, newUser.avatarURL())
            .setColor("#ff0000")
            .setFooter(newUser.guild.name, newUser.guild.iconURL())
            .setTitle("**Moderation** - User Updated")
            .addField('User', `<@${newUser.id}>`, true)
            .addField('Discriminator Was', `${oldUser.discriminator}`, true)
            .addField('Discriminator Now', `${newUser.discriminator}`, true)
            .addField('Username Was', oldUser.username, true)
            .addField('Username Now', newUser.username, true)
            .addField('Avatar Was', oldUser.displayAvatarURL, true)
            .addField('Avatar Now', newUser.displayAvatarURL, true)
            .setColor('0x00AAFF')
            .setTimestamp();
        // Send the message to the Mod Log Channel


        oldUser.guild.channels.cache.find(c => c.id == client.settings.get(oldUser.guild.id, "logchannel")).send({ embeds: [embed] });
        client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${oldUser.guild.name} triggered event: userUpdate Successfully`);
        //client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${message.guild.name} triggered event: MessageUpdate Successfully`);
    }
    //Logging Disabled do nothing.
*/
};