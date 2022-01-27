const db = require("quick.db")
const { MessageEmbed } = require("discord.js");
const { measureMemory } = require("vm");
module.exports = {
  name: "silentban", //the command name for the Slash Command
  category: "Moderation",
  usage: "silentban [member] [reason]",
  aliases: [],
  description: "Bans a member from the server silently!", //the command description for Slash Command Overview
  cooldown: 15,
  memberpermissions: ["MANAGE_MEMBERS"],
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  run: async (client, message, args) => {
    client.features.ensure(message.guild.id, {
      music: true,
      logs: true,
      reactionroles: true,
      moderation: true,
      fun: true,
      youtube: false,
      support: true,
      points: true,
    });
    if (client.features.get(message.guild.id, "moderation") == false) {
      return;
    } else {
      const target = args[0];
      if (isNaN(target)) return message.reply(`Please specify an ID`);

      const reason = args.splice(1, args.length).join(' ');

      try {
        message.guild.members.ban(target, { reason: reason.length < 1 ? 'No reason supplied.' : reason });
        const embed2 = new MessageEmbed()
          .setColor("GREEN")
          .setDescription("**They were successfully banned. User was not notified!**");
        await message.channel.send(embed2);
        const channel = db.fetch(`modlog_${message.guild.id}`);
        if (!channel) return;
        const embed = new MessageEmbed()
          .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
          .setColor("#ff0000")
          .setFooter(message.guild.name, message.guild.iconURL())
          .addField("**Moderation**", "ban")
          .addField("**ID**", `${target}`)
          .addField("**Banned By**", message.author.username)
          .addField("**Reason**", `${reason || "**No Reason**"}`)
          .addField("**Date**", message.createdAt.toLocaleString())
          .setTimestamp();

        var sChannel = message.guild.channels.cache.get(channel)
        if (!sChannel) return;
        sChannel.send(embed)

      } catch (e) {
        const { logMessage } = require(`../../handlers/newfunctions`);
        logMessage(client, `error`, message.guild, `Error with HACKBAN command: ${e.message} | ${e.stack}`);
      }
    }
  }
};