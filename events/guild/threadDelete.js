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
module.exports = async (client, thread) => {
    try {
        client.setup = botsql.prepare(`SELECT * FROM settings WHERE guildid = '${thread.guild.id}'`);
        if (!client.setup.all().length) {
            console.log(`${thread.guild.name} - Is not setup!`);
            return;
        }
        client.logchannel = botsql.prepare(`SELECT logchannel FROM settings WHERE guildid = '${thread.guild.id}'`);
        if (client.logchannel.get().logchannel) {
            const logchannel = thread.guild.channels.cache.get(client.logchannel.get().logchannel);
            const guild = sticker.guild;
            if (thread.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
                const embed = new EmbedBuilder();
                embed.setColor("#ff0000")
                embed.setTitle('**MODERATION LOG: THREAD DELETED**');
                embed.addFields(
                    { name: 'Thread Name::', value: `${thread.name}`, inline: true },
                    { name: 'Thread ID::', value: `${thread.id}`, inline: true },
                    { name: 'Thread Inviteable::', value: `${thread.invitable}`, inline: true },
                    { name: 'Thread locked::', value: `${thread.locked}`, inline: true },
                    { name: 'Thread Owner::', value: `<@${thread.OwnerId}>`, inline: true },
                    { name: 'Thread Archived::', value: `${thread.archived}`, inline: true },
                )
                embed.setTimestamp();

                logchannel.send({ embeds: [embed] });
            }
        }

    } catch (err) {
        console.log(err);
        client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
        return;
    }
}