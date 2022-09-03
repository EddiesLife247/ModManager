const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const config = require(`../../configs/config.json`);
const Discord = require(`discord.js`);
const SQLite = require("better-sqlite3");
const botsql = new SQLite(`./databases/bot.sqlite`);
const supsql = new SQLite(`./databases/suport.sqlite`);
const rrsql = new SQLite(`./databases/rr.sqlite`);
const bansql = new SQLite(`./databases/bans.sqlite`);
const scresql = new SQLite(`./databases/scores.sqlite`);
module.exports = async (client, guild) => {
    try {
        if (!guild.available) return; // If there is an outage, return.
        supsql.prepare(`DELETE FROM 'tickets' WHERE guild = '${guild.id}'`).run()
        rrsql.prepare(`DELETE FROM 'rrtable' WHERE guild = '${guild.id}'`).run()
        scresql.prepare(`DELETE FROM 'scores' WHERE guild = '${guild.id}'`).run()
        botsql.prepare(`DELETE FROM 'settings' WHERE guild = '${guild.id}'`).run()
        const embed = new EmbedBuilder();
        embed.setColor("#FF0000")
        embed.setTitle('**LEFT SERVER**');
        embed.addFields(
            { name: 'Guild:', value: `${guild.name}`, inline: true },
            { name: 'ID', value: `${guild.id}`, inline: false },
            { name: 'Owner ID:', value: `${guild.ownerId}`, inline: false },
        )
        embed.setTimestamp();
        //client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send({ embeds: [embed] }); // used for specific channel
        client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ embeds: [embed] });
        client.getBanned = bansql.prepare("SELECT * FROM bans WHERE guild = ?");
        const globalBanned = client.getBanned.get(guild.id);
        if (globalBanned) {
            for (const data of globalBanned) {
                try {
                    client.users.cache.get(data.user).send(`Ban on ${guild.name} has been removed as the bot has been removed or been deleted.`);
                } catch (err) {
                    console.log(err);
                    client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
                    return;
                }

            }
            bansql.prepare(`DELETE FROM 'bans' WHERE guild = '${guild.id}'`).run()
            console.log(client, "success", guild, `Left a discord server, Bans Deleted.`);
        }
    } catch (err) {
        console.log(err);
        client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
        return;
    }
};