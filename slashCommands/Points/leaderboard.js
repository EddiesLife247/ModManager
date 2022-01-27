const {
    MessageEmbed,
    Message
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const SQLite = require("better-sqlite3");
const sql = new SQLite(`./databases/scores.sqlite`);
const {
    check_if_dj
} = require("../../handlers/functions")
module.exports = {
    name: "leaderboard", //the command name for the Slash Command
    description: "Gives the Points Leaderboard", //the command description for Slash Command Overview
    cooldown: 10,
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    run: async (client, interaction) => {
        client.features.ensure(interaction.guild.id, {
			music: true,
			logs: true,
			reactionroles: true,
			moderation: true,
			fun: true,
			youtube: false,
			support: true,
			points: true,
		});
		if (client.features.get(interaction.guild.id, "points") == false) {
			return interaction.reply({
				embeds: [new MessageEmbed()
					.setColor(ee.wrongcolor)
					.setFooter(ee.footertext, ee.footericon)
					.setTitle(`Feature disabled on this server!`)
				],
				ephemeral: true
			});
		}
        try {
            //things u can directly access in an interaction!
            const {
                member,
            } = interaction;
            const {
            } = member;
            const {
            } = member.voice;
            client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
            client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");
            const top10 = sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 10;").all(interaction.guild.id);
            let score;
            console.log(interaction);
            score = client.getScore.get(interaction.user.id, interaction.guild.id);
            if (!score) {
                score = { id: `${interaction.guild.id}-${interaction.user.id}`, user: interaction.user.id, guild: interaction.guild.id, points: 0, level: 1 }
            }
            // Now shake it and show it! (as a nice embed, too!)
            const embed = new MessageEmbed()
                .setTitle("Leader board")
                .setAuthor(client.user.username, client.user.avatarURL())
                .setDescription("Our top 10 points leaders!")
                .setColor(0x00AE86);
            for (const data of top10) {
                embed.addFields({ name: client.users.cache.get(data.user).tag, value: `${data.points} points (level ${data.level})` });
            }
            await interaction.reply({ embeds: [embed] });
        }
        catch (err) {
            console.log(err);
        }
    }
}