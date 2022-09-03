const { EmbedBuilder, ApplicationCommandType, PermissionsBitField } = require('discord.js');
const Discord = require('discord.js');
const SQLite = require("better-sqlite3");
const botsql = new SQLite(`./databases/bot.sqlite`);
const bansql = new SQLite(`./databases/bans.sqlite`);
const config = require(`../../configs/config.json`);
module.exports = {
    name: 'botinfo',
    description: 'Displays Information about the bot',
    cooldown: 3000,
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        const embed = new EmbedBuilder();
        embed.setColor("#0000ff");
        embed.setTitle(`**Mod Manager** - V4.0(BETA)`);
        embed.setTimestamp();
        embed.setURL(`https://discord.gg/ynUy2Sfx9U`);
        embed.addFields(
            { name: 'Owner:', value: `EddieDoesStuff`, inline: true },
            { name: 'Support Server:', value: `https://discord.gg/ynUy2Sfx9U`, inline: true },
            { name: 'Dashboard:', value: `Dashboard Coming Soon`, inline: true },
            { name: 'Invite Me to your server:', value: `https://discord.com/api/oauth2/authorize?client_id=714939771935522838&permissions=1127763619046&redirect_uri=http%3A%2F%2Fmodmanager.manumission247.co.uk%3A2096%2Fcallback&response_type=code&scope=bot%20applications.commands`, inline: true },
            { name: 'Support Command:', value: `/help`, inline: true },
        );
        return interaction.reply({ content: `Hi, I am Mod Manager, here is some information about me!`, embeds: [embed], ephemeral: true });
    }
};