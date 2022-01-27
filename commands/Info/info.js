module.exports = {
  name: "info", //the command name for the Slash Command
  category: "Info",
  usage: "info",
  aliases: [],
  description: "Gets Developer Information and Support Links", //the command description for Slash Command Overview
  cooldown: 15,
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  run: async (client, message, args) => {
    try {
    message.reply("Hi, I am a bot being actively developed by Manumission247. Join the support server: https://discord.gg/HguA6J58u9");
    } catch (err) {
      const { logMessage } = require(`../../handlers/newfunctions`);
      logMessage(client, `error`, message.guild, `Error with INFO command: ${err.message} | \`\`\` ${err.stack} \`\`\``);
    }
  }
};