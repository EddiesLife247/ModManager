const { EmbedBuilder, ApplicationCommandType, } = require('discord.js');
  const config = require(`../../configs/config.json`);
  const SQLite = require("better-sqlite3");
  const Discord = require(`discord.js`);
module.exports = {
	name: 'User Info',
	cooldown: 3000,
	type: ApplicationCommandType.User,
    default_member_permissions: 'BanMembers', // permission required
	run: async (client, interaction) => {
        const member = interaction.guild.members.cache.get(interaction.options.get('user').value);
        const guild = interaction.guild;
        console.log(member.user.id);
            const bansql = new SQLite('./databases/bans.sqlite');
            var localBanCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'LOCAL' AND user = ${member.user.id}`).all();
            //console.log(localBanCount.length);
            var globalBanCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'GLOBAL' AND user = ${member.user.id}`).all();
            var KickCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'KICK' AND user = ${member.user.id}`).all();
            var warningCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'WARNING' AND user = ${member.user.id}`).all();
            var timeoutCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'TIMEOUT' AND user = ${member.user.id}`).all();
            if(localBanCount == ""){
                localBanCount = "0";
            }
            if(globalBanCount == ""){
                globalBanCount = "0";
            }
            if(KickCount == ""){
                KickCount = "0";
            }npm
            if(warningCount == ""){
                warningCount = "0";
            }
            if(timeoutCount == ""){
                timeoutCount = "0";
            }
        if (!interaction.isUserContextMenuCommand()) return;
            //console.log(`SELECT * FROM bans WHERE approved = 'LOCAL' AND user = ${member.user.id}`);
        const count = `\n Local Bans: ${localBanCount} \n Global Bans: ${globalBanCount} \n Kicks: ${KickCount} \n Warnings: ${warningCount} \n Timeouts: ${timeoutCount}`;

        const data = await getUserInfo(interaction, member.user.id);
        const embed = new EmbedBuilder();
    embed.setColor("#00ff00")
    embed.setTitle(`**User Info** - ${member.user.username}`)
    embed.setTimestamp();
    embed.addFields(
        { name: 'Username', value: `${member.user.username}` },
        { name: 'Code', value: `${member.user.discriminator}`, inline: true },
        { name: '\u200B', value: '\u200B' },
		{ name: 'Warnings:', value: `${warningCount}`, inline: true },
        { name: 'Kicks:', value: `${KickCount}`, inline: true },
        { name: 'Timouts:', value: `${timeoutCount}`, inline: true },
        { name: 'Local Bans:', value: `${localBanCount}`, inline: true },
        { name: 'Global Bans:', value: `${globalBanCount}`, inline: true },
	)
        await interaction.reply({ content: `User history: ${member.user.username}`, ephemeral: true, embeds: [embed] });

    }
};
async function getUserInfo(interaction,userid){
    const username = interaction.guild.members.cache.get(userid).user.username;
    const discriminator = interaction.guild.members.cache.get(userid).user.discriminator;
    const avatar = interaction.guild.members.cache.get(userid).user.avatar;
    return `\n Username: ${username}, \n Code: ${discriminator}, \n Avatar: ${avatar}`;
}