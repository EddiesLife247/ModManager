const { EmbedBuilder, ApplicationCommandType, } = require('discord.js');
module.exports = {
	name: 'Kick User',
	cooldown: 3000,
	type: ApplicationCommandType.User,
    default_member_permissions: 'KickMembers', // permission required
	run: async (client, interaction) => {
        
        if (!interaction.isUserContextMenuCommand()) return;
        //console.log(interaction);
        const member = interaction.guild.members.cache.get(interaction.options.get('user').value);
        interaction.reply({ content: `This would ban the user: ${member.user.username} but has been disabled for development.`, ephemeral: true });
        //member.kick();
        
        //interaction.reply({ content: `Kicked User: ${member.user.username}`, ephemeral: true });
    }
};