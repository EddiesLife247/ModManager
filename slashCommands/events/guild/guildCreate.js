const {
  MessageEmbed,
  Message
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require(`../../handlers/functions`);
const Discord = require(`discord.js`);
module.exports = async (client, guild) => {
  client.settings.ensure(guild.id, {
    prefix: config.prefix,
    defaultvolume: 50,
    defaultautoplay: false,
    defaultfilters: [`bassboost6`, `clear`],
    djroles: [],
    botchannel: [],
    logxhannel: [],
  })
  //logger.log(`[GUILD JOIN] ${guild.id} added the bot. Owner: ${guild.ownerId}`);
  let JoinEmbed = new Discord.MessageEmbed()
    .setTitle(`I joined a server`)
    .addField('Server ID: ', `${guild.id}`, true)
    .addField('Server Name: ', `${guild.name}`, true)
    .addField('Server Owner: ', `${guild.ownerID}`, true)
    .setColor([0, 255, 0]);
  client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send({ embeds: [JoinEmbed] }); // used for specific channel
};
