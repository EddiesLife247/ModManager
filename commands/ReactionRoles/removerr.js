const SQLite = require("better-sqlite3");
const rrsql = new SQLite(`./databases/rr.sqlite`);
module.exports = {
    name: "removerr", //the command name for execution & for helpcmd [OPTIONAL]

    category: "ReactionRoles",
    aliases: ["reactionroleremove"],
    usage: "removerr <emoji> <messageid> <channel>",

    cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
    description: "Add Reaction Role", //the command description for helpcmd [OPTIONAL]
    memberpermissions: ["MANAGE_ROLES"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
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
        if (client.features.get(message.guild.id, "reactionroles") == false) {
            return;
        } else {
            try {
                if (!message.mentions.channels.first()) return message.reply("Error: You did not mention a channel.");
                const rrchan = message.mentions.channels.first().id;
                const emojiID = args[0];
                const messageid = args[1];
                if (!emojiID) {
                    return message.reply("You have formatted this command incorrectly. (EMOJI MISSING) (See help rradd for more information).");
                }
                if (!messageid) {
                    return message.reply("You have formatted this command incorrectly. (MESSAGE ID MISSING) (See help rradd for more information).");
                }
                if (!args[2]) {
                    return message.reply("You have formatted this command incorrectly. (CHANNEL MISSING)(See help rradd for more information).");
                }
                if (emojiID != rrchan) {

                    client.getRr = rrsql.prepare("SELECT * FROM rrtable WHERE emoji = ?  AND guild = ? AND channel = ? AND messageid = ?");
                    client.addRr = rrsql.prepare("INSERT OR REPLACE INTO rrtable (id, emoji, guild, role, messageid, channel) VALUES (@id, @emoji, @guild, @role, @messageid, @rrchan);");
                    client.removeRr = rrsql.prepare("DELETE FROM rrtable WHERE emoji = ? AND guild = ? AND channel = ? AND messageid = ?");
                    let rr;
                    rr = client.getRr.get(emojiID, message.guild.id, rrchan, messageid);
                    if (rr) {
                        client.removeRr.run(emojiID, message.guild.id, rrchan, messageid);
                        try {
                            message.reply(`Removed: ${emojiID} on <#${rrchan}> for Message: ${messageid}`);
                        }
                        catch (err2) {
                            message.reply("There was an error! while reacting to the message!");
                            console.log(err2);
                        }

                        return;
                    } else {
                        return message.reply("This Reaction Role does not exist!");
                    }
                    // And we save it!
                } else {
                    return message.reply("You have formatted this command incorrectly. (CANNOT SET CHANNEL AS EMOJI) (See help rradd for more information).");
                }

            }
            catch (err) {
                message.reply("There was an error!");
                console.log(err);
                return;
            }
        }
    } catch (e) {
        const { logMessage } = require(`../../handlers/newfunctions`);
        logMessage(client, `error`, message.guild, `Error with REMOVERR command: ${e.message} | \`\`\` ${e.stack} \`\`\``);
    }
    }
};