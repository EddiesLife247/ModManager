const { EmbedBuilder, ApplicationCommandType, } = require('discord.js');
module.exports = {
	name: 'Ban User',
	cooldown: 3000,
	type: ApplicationCommandType.User,
    default_member_permissions: 'BanMembers', // permission required
	run: async (client, interaction) => {
        
        if (!interaction.isUserContextMenuCommand()) return;
        const member = interaction.guild.members.cache.get(interaction.options.get('user').value);
        const guild = interaction.guild;
        interaction.reply({ content: `This would ban the user: ${member.user.username} but has been disabled for development.`, ephemeral: true });
        //member.ban();
        //interaction.reply({ content: `Banned User: ${member.user.username}`, ephemeral: true });
    }
};