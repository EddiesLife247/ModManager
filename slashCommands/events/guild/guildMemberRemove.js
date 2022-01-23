const {
  MessageEmbed,
  Message
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require(`../../handlers/functions`);
const Discord = require(`discord.js`);
module.exports = async (client, member) => {
  client.settings.ensure(member.guild.id, {
    prefix: config.prefix,
    defaultvolume: 50,
    defaultautoplay: false,
    defaultfilters: [`bassboost6`, `clear`],
    djroles: [],
    botchannel: [],
    logxhannel: [],
  })
  // Load the guild's settings
  if (member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel"))) {
    const fetchedLogs = await member.guild.fetchAuditLogs({
      limit: 1,
      type: 'MEMBER_KICK',
    });
    //console.log(fetchedLogs);
    //return;
    const kickLog = fetchedLogs.entries.first();
    if (Date.now() - kickLog.createdTimestamp < 5000) {
      if (!kickLog) {
        var execute = "UNKNOWN";
      }
      const { executor, target } = kickLog;
      if (target.id === member.id) {
        var execute = executor.tag;
      }
      else {
        var execute = "UNKNOWN";
      }
    }
    else {
      var execute = "UNKNOWN";
    }
    const embed = new Discord.MessageEmbed()
      .setAuthor(`Modlogs`, member.guild.iconURL())
      .setColor("#ff0000")
      .setFooter(member.guild.name, member.guild.iconURL())
      .setTitle("**Moderation** - Member Left/Kicked")
      .addField("**Member**", `${member.user.tag}`, true)
      .addField("**Executor**", `${execute}`, true)
      .addField("**Reason**", `${kickLog.reason}`)
      .setTimestamp();
    if (member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel"))) {
      member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel")).send({ embeds: [embed] });
      //client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${message.guild.name} triggered event: GuildMemberRemove Successfully`);
      //console.log(`Found log channel and sent message: ${settings.modLogChannel} in ${member.guild.id}`);
    } else {
      //console.log(`Cannot find channel: ${settings.modLogChannel} in: ${member.guild.name}`);
    }
  }
  client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${member.guild.name} triggered event: GuildMemberAdd Successfully`);
};
