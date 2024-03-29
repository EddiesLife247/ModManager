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
module.exports = async (client, oldGuild, newGuild) => {
    try {
        //console.log(newGuild.id);
        client.logchannel = botsql.prepare(`SELECT logchannel FROM settings WHERE guildid = '${newGuild.id}'`);
        if (client.logchannel.all().length) {
            const logchannel = oldGuild.channels.cache.get(client.logchannel.get().logchannel);
            if(logchannel == null){
                return;
            }
            if (oldGuild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
                const embed = new EmbedBuilder();
                embed.setColor("#00ff00")
                embed.setTitle('**MODERATION LOG: GUILD CHANGED**');
                embed.addFields(
                    { name: 'Name Was', value: `${oldGuild.name}`, inline: true },
                    { name: 'Name Now', value: `${newGuild.name}`, inline: true },
                    { name: 'NSFW Level Was', value: `${oldGuild.nsfwLevel}`, inline: true },
                    { name: 'NSFW Level Now', value: `${newGuild.nsfwLevel}`, inline: true },
                    { name: 'Premium Tier Was', value: `${oldGuild.premiumTier}`, inline: true },
                    { name: 'Premium Tier Now', value: `${newGuild.premiumTier}`, inline: true },
                )
                embed.setTimestamp();

                logchannel.send({ embeds: [embed] });
                //client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send({ embeds: [embed] }); // used for specific channel
                client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ embeds: [embed] });
                console.log(`${oldGuild.name} changed details, now known as: ${newGuild.name}`);
            }
        }
    } catch (err) {
        console.log(err);
        client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
        return;
    }
};