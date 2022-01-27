const SQLite = require("better-sqlite3");
const sql = new SQLite(`./databases/scores.sqlite`);
const {
    MessageEmbed,
    Message
} = require("discord.js");
const Discord = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
    name: "pointsleaderboard", //the command name for execution & for helpcmd [OPTIONAL]

    category: "Points",
    aliases: ["leaders", "leaderboard"],
    usage: "pointsleaderboard",

    cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
    description: "See the Points Leaderboard", //the command description for helpcmd [OPTIONAL]
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    run: async (client, message, args) => {
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
        if (client.features.get(message.guild.id, "points") == false) {
            return;
        } else {
            client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
            client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");
            const top10 = sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 10;").all(message.guild.id);
            let score;
            score = client.getScore.get(message.author.id, message.guild.id);
            if (!score) {
                score = { id: `${message.guild.id}-${message.author.id}`, user: message.author.id, guild: message.guild.id, points: 0, level: 1 }
            }
            // Now shake it and show it! (as a nice embed, too!)
            const embed = new Discord.MessageEmbed()
                .setTitle("Leader board")
                .setAuthor(client.user.username, client.user.avatarURL())
                .setDescription("Our top 10 points leaders!")
                .setColor(0x00AE86);

            for (const data of top10) {
                embed.addFields({ name: client.users.cache.get(data.user).tag, value: `${data.points} points (level ${data.level})` });
            }
            message.channel.send({ embeds: [embed] });
        }
    }
};