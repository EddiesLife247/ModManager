module.exports = {
  name: "kick", //the command name for the Slash Command
  category: "Moderation",
  usage: "kick [member] [reason]",
  aliases: [],
  description: "Kicks a member from the server", //the command description for Slash Command Overview
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
      const modRole = message.guild.roles.cache.find(role => role.name === "Mods");
      if (!modRole)
        return console.log("The Mods role does not exist");

      if (!message.member.roles.cache.has(modRole.id))
        return message.reply("You can't use this command.");

      if (message.mentions.members.size === 0)
        return message.reply("Please mention a user to kick");

      if (!message.guild.me.permissions.has("KICK_MEMBERS"))
        return message.reply("");

      const kickMember = message.mentions.members.first();

      kickMember.kick(reason.join(" ")).then(member => {
        message.reply(`${member.user.username} was succesfully kicked.`);
      });
    }
  } catch (e) {
    const { logMessage } = require(`../../handlers/newfunctions`);
    logMessage(client, `error`, message.guild, `Error with KICK command: ${e.message} | \`\`\` ${e.stack} \`\`\``);
  }
  },
};