const SQLite = require("better-sqlite3");
const rrsql = new SQLite(`./databases/rr.sqlite`);
module.exports = {
    name: "rrlist", //the command name for execution & for helpcmd [OPTIONAL]

    category: "ReactionRoles",
    aliases: ["reactionrolelist"],
    usage: "rrlist",

    cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
    description: "List All Reaction Roles for the Guild", //the command description for helpcmd [OPTIONAL]
    memberpermissions: ["MANAGE_ROLES"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    run: async (client, message, args) => {
        client.features.ensure(guild.id, {
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
            //console.log(message.content);
            try {
                client.getRr = rrsql.prepare("SELECT * FROM rrtable WHERE emoji = ?  AND guild = ? AND channel = ? AND messageid = ?");
                client.addRr = rrsql.prepare("INSERT OR REPLACE INTO rrtable (id, emoji, guild, role, messageid, channel) VALUES (@id, @emoji, @guild, @role, @messageid, @rrchan);");
                client.removeRr = rrsql.prepare("DELETE FROM rrtable WHERE emoji = ? AND guild = ? AND channel = ?");
                const top10 = rrsql.prepare("SELECT * FROM rrtable WHERE guild = ?").all(message.guild.id);
                var rrlist = "";
                for (const data of top10) {
                    rrlist += `${data.emoji} =  <@&${data.role}> on: <#${data.channel}> for Message: ${data.messageid} \n`;
                }
                message.reply(rrlist);
                // And we save it!
            }
            catch (err) {
                message.reply("There was an error!");
                console.log(err);
                return;
            }
        }
    }
};