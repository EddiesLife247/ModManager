module.exports = {
    name: "terms", //the command name for the Slash Command
    category: "Info",
    usage: "terms",
    aliases: [],
    description: "Gets The Terms and Conditions Link", //the command description for Slash Command Overview
    cooldown: 15,
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    run: async (client, message, args) => {
        try {
        message.reply("View the Terms and Conditions on the Dashboard at: http://modmanager.manumission247.co.uk:38455/terms");
        } catch (err) {
            const { logMessage } = require(`../../handlers/newfunctions`);
            logMessage(client, `error`, message.guild, `Error with TERMS command: ${err.message} | ${err.stack}`);
        }
    }
};