const { EmbedBuilder, Collection, PermissionsBitField, AuditLogEvent } = require('discord.js')
const ms = require('ms');
const config = require('../../configs/config.json');
const SQLite = require("better-sqlite3");
var Filter = require('bad-words'),
	filter = new Filter();
const cooldown = new Collection();
const scoresql = new SQLite(`./databases/scores.sqlite`);
const bansql = new SQLite(`./databases/bans.sqlite`);
const botsql = new SQLite(`./databases/bot.sqlite`);
module.exports = async (client, oldUser, newUser) => {
    try {
        client.setup = botsql.prepare(`SELECT * FROM settings WHERE guildid = '${oldUser.guild.id}'`);
		if (!client.setup.all().length) {
			console.log(`${oldUser.guild.name} - Is not setup!`);
			return;
		}
        client.logchannel = botsql.prepare(`SELECT logchannel FROM settings WHERE guildid = '${thread.guild.id}'`);
        if (client.logchannel.get().logchannel) {
            const logchannel = thread.guild.channels.cache.get(client.logchannel.get().logchannel);
			const guild = sticker.guild;
            if (thread.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
                const embed = new EmbedBuilder();
                embed.setColor("#00ff00")
                embed.setTitle('**MODERATION LOG: USER CHANGED**');
                embed.addFields(
                    { name: 'User:', value: `${newUser.id}`, inline: true },
                    { name: 'Discriminator Was', value: `${oldUser.discriminator}`, inline: true },
                    { name: 'Discriminator Now', value: `${newUser.discriminator}`, inline: true },
                    { name: 'Username Was', value: `${oldUser.username}`, inline: true },
                    { name: 'Username Now', value: `${newUser.username}`, inline: true },
                )
                embed.setTimestamp();

                logchannel.send({ embeds: [embed] });
            }
        }
    } catch (err) {
        console.log(error);
    }
};