var createIssue = require('github-create-issue');
const Discord = require("discord.js");
module.exports = {
  name: "report", //the command name for the Slash Command
  category: "Settings",
  usage: "report",
  aliases: [],
  description: "shows how to report bugs to Mod Manager staff", //the command description for Slash Command Overview
  cooldown: 15,
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  run: async (client, message, args) => {
    try {
      message.reply(`** MOVED TO GITHUB ** \n Please log your issue to github! Visit: https://github.com/manumission247/ModManager/issues for more information.`);
    } catch (e) {
      const { logMessage } = require(`../../handlers/newfunctions`);
      logMessage(client, `error`, message.guild, `Error with REPORT command: ${e.message} | \`\`\` ${e.stack} \`\`\``);
  }
    }
};