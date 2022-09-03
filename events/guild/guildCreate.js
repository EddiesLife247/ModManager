const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const config = require(`../../configs/config.json`);
const Discord = require(`discord.js`);
const SQLite = require("better-sqlite3");
const botsql = new SQLite(`./databases/bot.sqlite`);
module.exports = async (client, guild) => {
    try {
        const top10 = botsql.prepare("SELECT * FROM guildadmin WHERE account = ? AND type = 'GUILDBAN'").all(guild.id);
        if (top10.length >= 1) {
            for (const data of top10) {
                const channel = guild.channels.cache.filter(m => m.type === 'GUILD_TEXT').first();
                channel.send(`Sorry, ModManager is not permitted to join this server for: \`\`\`${data.reason} \`\`\` Contact support if you think this is an error: https://discord.gg/ZqUSVpDcRq`)
                client.guilds.cache.get(guild.id).leave()
                console.log(client, "success", guild, `Joined and Left due to Guild Ban for reason: ${data.reason}`);
                client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `I was invited to: ${guild.name}, but have been blocked from joining so left` });
            }
        }
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
        channel.send({ embeds: [welcome] })
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
    } catch (err) {
        console.log(err);
        client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
        return;
    }
};
