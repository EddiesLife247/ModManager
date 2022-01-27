const {
  MessageEmbed,
  Message
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require(`../../handlers/functions`);
const Discord = require(`discord.js`);
const { logMessage } = require(`../../handlers/newfunctions`);
module.exports = async (client, channel) => {
  const guild = channel.guild;
  if (guild.me.permissions.has("VIEW_AUDIT_LOG")) {
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
      //console.log(channel.guild.channels.cache.find(c => c.name == settings.modLogChannel));
      const embed = new Discord.MessageEmbed()
        .setAuthor(`Modlogs`, channel.guild.iconURL())
        .setColor("#0000ff")
        .setFooter(channel.guild.name, channel.guild.iconURL())
        .addField("**Moderation**", "Updated Channel Pins")
        .addField("**Channel**", channel.name)
        .setTimestamp();
      if (channel.guild.channels.cache.find(c => c.id == client.settings.get(channel.guild.id, "logchannel"))) {
        channel.guild.channels.cache.find(c => c.id == client.settings.get(channel.guild.id, "logchannel")).send({ embeds: [embed] });
        logMessage(client, "success", channel.guild, "Channel Pins Log Message");
      }
      //console.log(`pin updated in a guild that has logs enabled!`);
    }
    else {
      logMessage(client, "Logs Disabled", channel.guild, "Channel Pins Log Message");
      //console.log(`pin updated in a guild that has logs disabled!`);
      return;
    }
  }

};