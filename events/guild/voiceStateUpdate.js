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
module.exports = async (client, oldState, newState) => {
  try {
  client.features.ensure(newState.guild.id, {
    music: true,
    logs: true,
    reactionroles: true,
    moderation: true,
    fun: true,
    youtube: false,
    support: true,
    points: true,
});
if (client.features.get(newState.guild.id, "logs") == false) {
    return;
}
  //console.log(channel.guild.channels.cache.find(c => c.name == settings.modLogChannel));
  //console.log(`member joined guild that has logs enabled!`);
  var userDetail = client.users.cache.find(user => user.id === oldState.id).tag;
  client.settings.ensure(oldState.guild.id, {
    logchannel: []
  })
  if (newState.channelId == null) {
    const embed = new Discord.MessageEmbed()
      .setAuthor(`Modlogs`, oldState.guild.iconURL())
      .setColor("#ff0000")
      .setFooter(oldState.guild.name, oldState.guild.iconURL())
      .setTitle("**Moderation** - Member Left Voice Channel")
      .addField("**Member**", `${userDetail}`)
      .setTimestamp();
    if (oldState.guild.channels.cache.find(c => c.id == client.settings.get(oldState.guild.id, "logchannel"))) {
      oldState.guild.channels.cache.find(c => c.id == client.settings.get(oldState.guild.id, "logchannel")).send({ embeds: [embed] });
      logMessage(client, "success", oldState.guild, `Voice Connection Left`);
    }
  } else {
    if (oldState.channelId == undefined) {
      var channelDetails = newState.guild.channels.cache.find(c => c.id == newState.channelId);
      //console.log(channelDetails);
      const embed = new Discord.MessageEmbed()
        .setAuthor(`Modlogs`, oldState.guild.iconURL())
        .setColor("#00ff00")
        .setFooter(oldState.guild.name, oldState.guild.iconURL())
        .setTitle("**Moderation** - Member Joined Voice Channel")
        .addField("**Member**", `${userDetail}`)
        .addField("**Current Voice Channel**", `${channelDetails.name}`)
        .setTimestamp();
      if (oldState.guild.channels.cache.find(c => c.id == client.settings.get(oldState.guild.id, "logchannel"))) {
        oldState.guild.channels.cache.find(c => c.id == client.settings.get(oldState.guild.id, "logchannel")).send({ embeds: [embed] });
        logMessage(client, "success", oldState.guild, `Voice Connection Joined`);
      }
    }
  }
  /*
 if (
   (!oldState.streaming && newState.streaming) ||
   (oldState.streaming && !newState.streaming) ||
   (!oldState.serverDeaf && newState.serverDeaf) ||
   (oldState.serverDeaf && !newState.serverDeaf) ||
   (!oldState.serverMute && newState.serverMute) ||
   (oldState.serverMute && !newState.serverMute) ||
   (!oldState.selfDeaf && newState.selfDeaf) ||
   (oldState.selfDeaf && !newState.selfDeaf) ||
   (!oldState.selfMute && newState.selfMute) ||
   (oldState.selfMute && !newState.selfMute) ||
   (!oldState.selfVideo && newState.selfVideo) ||
   (oldState.selfVideo && !newState.selfVideo)
 )
   if (!oldState.channelId && newState.channelId) {
     if (newState.channel.type == "GUILD_STAGE_VOICE" && newState.guild.me.voice.suppress) {
       try {
         await newState.guild.me.voice.setSuppressed(false);
       } catch (e) {
         console.log(String(e).grey)
       }
     }
     return
   }
 if (oldState.channelId && !newState.channelId) {
   return
 }
 if (oldState.channelId && newState.channelId) {
   if (newState.channel.type == "GUILD_STAGE_VOICE" && newState.guild.me.voice.suppress) {
     try {
       await newState.guild.me.voice.setSuppressed(false);
     } catch (e) {
       console.log(String(e).grey)
     }
   }
   return;
 }
 */
} catch (e) {
  const { logMessage } = require(`../../handlers/newfunctions`);
  logMessage(client, `error`, newState.guild, `Error with VOICE STATE UPDATE event: ${e.message} | \`\`\` ${e.stack} \`\`\``);
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