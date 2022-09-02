const { EmbedBuilder, ApplicationCommandType, PermissionsBitField } = require('discord.js');
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
            { name: 'Support Command:', value: `/help`, inline: true },
        );
        return interaction.reply({ content: `Hi, I am Mod Manager, here is some information about me!`, embeds: [embed], ephemeral: true });
    }
};