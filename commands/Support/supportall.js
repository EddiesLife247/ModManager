const SQLite = require("better-sqlite3");
const Discord = require(`discord.js`);
const supsql = new SQLite(`./databases/support.sqlite`);
module.exports = {
    name: "supportlist", //the command name for execution & for helpcmd [OPTIONAL]

    category: "Support",
    aliases: ["listtickets"],
    usage: "supportlist [open/closed/deleted]",

    cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
    description: "List All Support Tickets for the Guild", //the command description for helpcmd [OPTIONAL]
    memberpermissions: ["MANAGE_ROLES"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    run: async (client, message, args) => {
        //console.log(message.content);
        try {
            if (args[0] == null) {
                const top10 = supsql.prepare("SELECT * FROM tickets WHERE guild = ?").all(message.guild.id);
                var rrlist = "";
                const embed = new Discord.MessageEmbed()
                    .setAuthor(`Support Team`, message.channel.guild.iconURL())
                    .setTitle('Support Ticket List')
                    .setColor("#ff33ff")
                    .setFooter(message.channel.guild.name, message.channel.guild.iconURL())
                for (const data of top10) {
                    embed.addField("**User**", `<@${data.user}>`, true)
                    embed.addField("**Subject**", `${data.subject}`, true)
                    embed.addField("**Status**", `${data.status}`, true)
                }
                message.channel.send({ embeds: [embed] });
                // And we save it!
            }
            else {
                if (args[0].toLowerCase == "open") {
                    const top10 = supsql.prepare("SELECT * FROM tickets WHERE guild = ? AND status = 'Open'").all(message.guild.id);
                    var rrlist = "";
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(`Support Team`, message.channel.guild.iconURL())
                        .setTitle('Support Ticket List')
                        .setColor("#ff33ff")
                        .setFooter(message.channel.guild.name, message.channel.guild.iconURL())
                    for (const data of top10) {
                        embed.addField("**User**", `<@${data.user}>`, true)
                        embed.addField("**Subject**", `${data.subject}`, true)
                        embed.addField("**Status**", `${data.status}`, true)
                    }
                    message.channel.send({ embeds: [embed] });
                    // And we save it!
                }
                else if (args[0].toLowerCase == "closed") {
                    const top10 = supsql.prepare("SELECT * FROM tickets WHERE guild = ? AND status = 'Closed'").all(message.guild.id);
                    var rrlist = "";
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(`Support Team`, message.channel.guild.iconURL())
                        .setTitle('Support Ticket List')
                        .setColor("#ff33ff")
                        .setFooter(message.channel.guild.name, message.channel.guild.iconURL())
                    for (const data of top10) {
                        embed.addField("**User**", `<@${data.user}>`, true)
                        embed.addField("**Subject**", `${data.subject}`, true)
                        embed.addField("**Status**", `${data.status}`, true)
                    }
                    message.channel.send({ embeds: [embed] });
                    // And we save it!
                }
                else if (args[0].toLowerCase == "deleted") {
                    const top10 = supsql.prepare("SELECT * FROM tickets WHERE guild = ? AND status = 'Closed / Deleted'").all(message.guild.id);
                    var rrlist = "";
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(`Support Team`, message.channel.guild.iconURL())
                        .setTitle('Support Ticket List')
                        .setColor("#ff33ff")
                        .setFooter(message.channel.guild.name, message.channel.guild.iconURL())
                    for (const data of top10) {
                        embed.addField("**User**", `<@${data.user}>`, true)
                        embed.addField("**Subject**", `${data.subject}`, true)
                        embed.addField("**Status**", `${data.status}`, true)
                    }
                    message.channel.send({ embeds: [embed] });
                    // And we save it!
                }
            }
        }
        catch (err) {
            message.reply("There was an error!");
            console.log(err);
            return;
        }
    }
};