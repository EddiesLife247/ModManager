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
        if (thread.joinable) {
            try {
                await thread.join();
            } catch (e) {
                console.log(e)
            }
        }
        client.logchannel = botsql.prepare(`SELECT logchannel FROM settings WHERE guildid = '${thread.guild.id}'`);
        if (client.logchannel.get().logchannel) {
            const logchannel = thread.guild.channels.cache.get(client.logchannel.get().logchannel);
            const guild = sticker.guild;
            if (thread.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
                const embed = new EmbedBuilder();
                embed.setColor("#00ff00")
                embed.setTitle('**MODERATION LOG: THREAD CREATED**');
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
    }
}