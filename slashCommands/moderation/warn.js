const { EmbedBuilder, ApplicationCommandType, } = require('discord.js');
const Discord = require('discord.js');
const db = require('quick.db');
const SQLite = require("better-sqlite3");
const bansql = new SQLite(`./databases/bans.sqlite`);
const config = require(`../../configs/config.json`);
module.exports = {
	name: 'Warn user',
	cooldown: 3000,
	type: ApplicationCommandType.User,
    default_member_permissions: 'KickMembers', // permission required
	run: async (client, interaction) => {
        const member = interaction.guild.members.cache.get(interaction.options.get('user').value);
        member.send(`You have been warned by <${message.author.username}> for this reason: ${reason}`)
        .catch(error => message.channel.send(`Sorry <${message.author}> I couldn't n't warn because of : ${error}`));
        // Message Embed
        const embed = new EmbedBuilder();
        embed.setColor("#00ff00")
        embed.setTitle(`**Warning Recieved** - ${member.user.username}`)
        embed.setTimestamp();
        embed.addFields(
            { name: 'Username', value: `${member.user.username}` },
            { name: 'Code', value: `${member.user.discriminator}`, inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: 'Reason:', value: `${reason}`, inline: true },
        )
            await interaction.reply({ content: `User has been warned: ${member.user.username}`, ephemeral: true, embeds: [embed] });
    
        }
    };
    
    