const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
  name: "purge", //the command name for the Slash Command
  category: "Moderation",
  usage: "purge [1-100]",
  aliases: [],
  memberpermissions: ["MANAGE_MESSAGES"],
  description: "Removes up to 100 Messages from the server", //the command description for Slash Command Overview
  cooldown: 15,
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
      if (isNaN(args[0]))
        return message.channel.send('**Please Supply A Valid Amount To Delete Messages!**');

      if (args[0] > 100)
        return message.channel.send("**Please Supply A Number Less Than 100!**");

      if (args[0] < 1)
        return message.channel.send("**Please Supply A Number More Than 1!**");

      message.channel.bulkDelete(args[0])
        .then(messages => message.channel.send(`**Succesfully deleted \`${messages.size}/${args[0]}\` messages**`).then(msg => msg.delete({ timeout: 5000 }))).catch(() => null)
    }
  }

};