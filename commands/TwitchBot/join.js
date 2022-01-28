const SQLite = require("better-sqlite3");

module.exports = {
    name: "join", //the command name for execution & for helpcmd [OPTIONAL]

    category: "Twitch",
    aliases: ["join"],
    usage: "join",

    cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
    description: "Joins the Twitch Channel that's in the dashboard", //the command description for helpcmd [OPTIONAL]
    memberpermissions: ["MANAGE_ROLES"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    run: async (client, message, args) => {
        const { joinChannel } = require(`../../TwitchBot/index`);
        const guild = message.guild.id;
        const twitchsql = new SQLite(`./databases/twitch.sqlite`);
        const twitchchannel = twitchsql.prepare(`SELECT * FROM twitch WHERE guild = ?`).all(guild);

        for (const data of twitchchannel) {
            var twitchchat = data.twitch;
            console.log(twitchchat);
            if(twitchchat){
                joinChannel(twitchchat);
                message.reply(`Joined channel: ${twitchchat}`);
             } else {
                 message.reply("There is no twitch channel set in the dashboard?");
             }
        }
    }
}