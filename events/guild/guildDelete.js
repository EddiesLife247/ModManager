const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const config = require(`../../configs/config.json`);
const Discord = require(`discord.js`);
const SQLite = require("better-sqlite3");
const botsql = new SQLite(`./databases/bot.sqlite`);
const supsql = new SQLite(`./databases/suport.sqlite`);
const rrsql = new SQLite(`./databases/rr.sqlite`);
const bansql = new SQLite(`./databases/bans.sqlite`);
const emdssql = new SQLite(`./databases/embeds.sqlite`);
module.exports = async (client, guild) => {
    console.log(`Left: ${guild.name} with id: ${guild.id}`);
    try {
        if (!guild.available) return; // If there is an outage, return.
        //supsql.prepare(`DELETE FROM 'tickets' WHERE guild = '${guild.id}'`).run()
        rrsql.prepare(`DELETE FROM 'rrtable' WHERE guild = '${guild.id}'`).run()
        rrsql.prepare(`DELETE FROM 'rrmsg' WHERE guild = '${guild.id}'`).run()
        botsql.prepare(`DELETE FROM 'settings' WHERE guildid = '${guild.id}'`).run()
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

            bansql.prepare(`DELETE FROM 'bans' WHERE guild = '${guild.id}'`).run()
            console.log(`I Left: ${guild.name} server, Bans Deleted.`);
    } catch (err) {
        console.log(err);
        client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
        return;
    }
};