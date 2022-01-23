const SQLite = require("better-sqlite3");
const sql = new SQLite(`./databases/scores.sqlite`);
module.exports = {
    name: "points", //the command name for execution & for helpcmd [OPTIONAL]

    category: "Points",
    aliases: ["botch"],
    usage: "points",

    cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
    description: "View your current Points", //the command description for helpcmd [OPTIONAL]
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    run: async (client, message, args) => {
        client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
        client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");
        let score;
        score = client.getScore.get(message.author.id, message.guild.id);
        if (!score) {
            score = { id: `${message.guild.id}-${message.author.id}`, user: message.author.id, guild: message.guild.id, points: 0, level: 1 }
        }
        return message.reply(`You currently have ${score.points} points and are level ${score.level}!`);
    }
};
// You can modify the code below to remove points from the mentioned user as well!


