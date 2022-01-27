const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
  name: "undeafen", //the command name for the Slash Command
  category: "Moderation",
  usage: "undeafen [member] [reason]",
  aliases: [],
  description: "Undeafen's a member from the server", //the command description for Slash Command Overview
  cooldown: 15,
  memberpermissions: ["MANAGE_MEMBERS"],
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  run: async (client, message, args) => {
    try {
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

      let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase());

      if (!member) return message.channel.send("Unable to find the mentioned user in this guild.")

      let reason = args.slice(1).join(" ");
      if (!reason) reason = "No Reason Provided"


      try {
        member.voice.setDeaf(false, reason);
        message.channel.send("Success ✅ : Member Undeafened")
      }

      catch (error) {
        console.log(error)
        message.channel.send("Oops! An unknow error occured. Please try again later.")
      }

    }
  } catch (e) {
    const { logMessage } = require(`../../handlers/newfunctions`);
    logMessage(client, `error`, message.guild, `Error with UNDEAFEN command: ${e.message} | ${e.stack}`);
  }
  }
  };