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
module.exports = async (client, sticker) => {
	try {
        client.setup = botsql.prepare(`SELECT * FROM settings WHERE guildid = '${sticker.guild.id}'`);
		if (!client.setup.all().length) {
			console.log(`${sticker.guild.name} - Is not setup!`);
			return;
		}
        client.logchannel = botsql.prepare(`SELECT logchannel FROM settings WHERE guildid = '${sticker.guild.id}'`);
        if (client.logchannel.get().logchannel) {
            const logchannel = sticker.guild.channels.cache.get(client.logchannel.get().logchannel);
			const guild = sticker.guild;
            if (sticker.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
                const embed = new EmbedBuilder();
                embed.setColor("#ff0000")
                embed.setTitle('**MODERATION LOG: Sticker DELETED**');
                embed.addFields(
                    { name: 'Sticker Name::', value: `${sticker.name}`, inline: true },
                )
                embed.setTimestamp();

                logchannel.send({ embeds: [embed] });
            }
        }
        console.log(`Sticker Deleted in: ${sticker.guild.name}.`);

    } catch (err) {
        console.log(err);
        client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
        return;
    }
}