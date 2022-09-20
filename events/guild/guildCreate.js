const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const config = require(`../../configs/config.json`);
const Discord = require(`discord.js`);
const SQLite = require("better-sqlite3");
const botsql = new SQLite(`./databases/bot.sqlite`);
module.exports = async (client, guild) => {
    console.log(`Joined: ${guild.name} with id: ${guild.id}`);
    try {
        const channel = guild.channels.cache.filter(m => m.type === 'GUILD_TEXT').first();
        const welcome = new EmbedBuilder();
        welcome.setColor("#0000ff");
        welcome.setTitle(`**Mod Manager** - V4.0(BETA)`);
        welcome.setDescription(`Thank you for inviting me to your server, to get setup run /config and configure the bot. \n *NOTE:* You must have the MANAGE SERVER permission to run this command.`);
        welcome.setTimestamp();
        welcome.setURL(`https://discord.gg/ynUy2Sfx9U`);
        welcome.addFields(
            { name: 'Bot Owner:', value: `EddieDoesStuff`, inline: true },
            { name: 'Support Server:', value: `https://discord.gg/ynUy2Sfx9U`, inline: true },
            { name: 'Dashboard:', value: `Dashboard Coming Soon`, inline: true },
            { name: 'Support Command:', value: `/help`, inline: true },
            { name: 'Configuration/Setup:', value: `/config`, inline: true },
        );
        try {
        channel.send({ embeds: [welcome] })
        } catch (error) {
            console.log(`No permissions to send to ${guild.name}`)
        }
        const embed = new EmbedBuilder();
        embed.setColor("#00FF00")
        embed.setTitle('**JOINED SERVER**');
        embed.addFields(
            { name: 'Guild:', value: `${guild.name}`, inline: true },
            { name: 'ID', value: `${guild.id}`, inline: false },
            { name: 'Owner ID:', value: `${guild.ownerId}`, inline: false },
        )
        embed.setTimestamp();
        //client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send({ embeds: [embed] }); // used for specific channel
        client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ embeds: [embed] });
        console.log(`I Joined: ${guild.name} server.`);
    } catch (err) {
        console.log(err);
        client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
        return;
    }
};
