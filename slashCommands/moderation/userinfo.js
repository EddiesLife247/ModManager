const { EmbedBuilder, ApplicationCommandType, } = require('discord.js');
const Discord = require('discord.js');
const SQLite = require("better-sqlite3");
const botsql = new SQLite(`./databases/bot.sqlite`);
const bansql = new SQLite(`./databases/bans.sqlite`);
const config = require(`../../configs/config.json`);
module.exports = {
	name: 'User Info',
	cooldown: 3000,
	type: ApplicationCommandType.User,
	run: async (client, interaction) => {
        try {
            client.setup = botsql.prepare(`SELECT * FROM settings WHERE guildid = '${interaction.guild.id}'`);
            if (!client.setup.all().length) {
                return interaction.reply("The bot has not been configured yet, run /config to setup the bot.");
            }
        const member = interaction.guild.members.cache.get(interaction.options.get('user').value);
        const guild = interaction.guild;
        //console.log(member.user.id);
            const bansql = new SQLite('./databases/bans.sqlite');
            var localBanCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'LOCAL' AND user = ${member.user.id}`).all();
            //console.log(localBanCount.length);
            var globalBanCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'GLOBAL' AND user = ${member.user.id}`).all();
            var KickCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'KICK' AND user = ${member.user.id}`).all();
            var warningCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'WARNING' AND user = ${member.user.id}`).all();
            var timeoutCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'TIMEOUT' AND user = ${member.user.id}`).all();
        if (!interaction.isUserContextMenuCommand()) return;
            //console.log(`SELECT * FROM bans WHERE approved = 'LOCAL' AND user = ${member.user.id}`);
        const count = `\n Local Bans: ${localBanCount} \n Global Bans: ${globalBanCount} \n Kicks: ${KickCount} \n Warnings: ${warningCount} \n Timeouts: ${timeoutCount}`;

        const data = await getUserInfo(interaction, member.user.id);
        client.getWarning = bansql.prepare(`SELECT * FROM bans WHERE user = ${member.user.id} ORDER BY date DESC
        LIMIT 1`);
        let getWarning = '';
        if(client.getWarning.all().length) {
            getWarning = client.getWarning.get().reason;
        } else {
            getWarning = 'No Punishments';
        }
        //console.log(client.getWarning.get());
        const embed = new EmbedBuilder();
    embed.setColor("#00ff00")
    embed.setTitle(`**User Info** - ${member.user.username}`)
    embed.setTimestamp();
    embed.addFields(
        { name: 'Username', value: `${member.user.username}` },
        { name: 'Code', value: `${member.user.discriminator}`, inline: true },
        { name: '\u200B', value: '\u200B' },
		{ name: 'Warnings:', value: `${warningCount.length}`, inline: true },
        { name: 'Kicks:', value: `${KickCount.length}`, inline: true },
        { name: 'Timouts:', value: `${timeoutCount.length}`, inline: true },
        { name: 'Local Bans:', value: `${localBanCount.length}`, inline: true },
        { name: 'Global Bans:', value: `${globalBanCount.length}`, inline: true },
        { name: 'Last Punishment Reason:', value: `${getWarning}`, inline: true },
	)
        await interaction.reply({ content: `User history: ${member.user.username}`, ephemeral: true, embeds: [embed] });
    } catch (err) {
        console.log(err);
        interaction.followUp('There was an error seek support!');
        client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
    }
    }
};
async function getUserInfo(interaction,userid){
    const username = interaction.guild.members.cache.get(userid).user.username;
    const discriminator = interaction.guild.members.cache.get(userid).user.discriminator;
    const avatar = interaction.guild.members.cache.get(userid).user.avatar;
    return `\n Username: ${username}, \n Code: ${discriminator}, \n Avatar: ${avatar}`;
}