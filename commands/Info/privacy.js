module.exports = {
    name: "privacy", //the command name for the Slash Command
    category: "Info",
    usage: "privacy",
    aliases: [],
    description: "Gets The Privacy Policy Link", //the command description for Slash Command Overview
    cooldown: 15,
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    run: async (client, message, args) => {
        message.reply("View the Privacy Policy on the Dashboard at: http://modmanager.manumission247.co.uk:38455/privacy");
    }
};