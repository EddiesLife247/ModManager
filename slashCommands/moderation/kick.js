const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Discord = require('discord.js');
const db = require('quick.db');
const SQLite = require("better-sqlite3");
const bansql = new SQLite(`./databases/bans.sqlite`);
const botsql = new SQLite(`./databases/bot.sqlite`);
const config = require(`../../configs/config.json`);
module.exports = {
    name: 'Kick User',
    cooldown: 3000,
    type: ApplicationCommandType.User,
    default_member_permissions: 'KickMembers', // permission required
    run: async (client, interaction) => {
        try {
        const member = interaction.guild.members.cache.get(interaction.options.get('user').value);
        if(interaction.guild.ownerId == member.user.id) { 
            interaction.reply('You cannot kick the onwer of the server');
            return;
        }
        const modal = new ModalBuilder()
            .setCustomId('myModal')
            .setTitle(`Kicking ${member.user.username}`);

        const ReasonInput = new TextInputBuilder()
            .setCustomId('ReasonInput')
            // The label is the prompt the user sees for this input
            .setLabel("Why are we kicking the user?")
            // Short means only a single line of text
            .setStyle(TextInputStyle.Short);
        const firstActionRow = new ActionRowBuilder().addComponents(ReasonInput);
        modal.addComponents(firstActionRow);
        await interaction.showModal(modal);
        const submitted = await interaction.awaitModalSubmit({
            // Timeout after a minute of not receiving any valid Modals
            time: 60000,
            // Make sure we only accept Modals from the User who sent the original Interaction we're responding to
            filter: i => i.user.id === interaction.user.id,
        }).catch(error => {
            // Catch any Errors that are thrown (e.g. if the awaitModalSubmit times out after 60000 ms)
            console.error(error)
            return null
        })
        if (submitted) {
            var reason = submitted.fields.getTextInputValue('ReasonInput');
            console.log(reason);
            /*member.timeout(5 * 60 * 1000, 'User was warned')
    .then(() => console.log("Timed out member"))
    .catch(console.log);
    */
            client.warnkick = botsql.prepare(`SELECT settingValue FROM settings WHERE setting = 'warnkick' AND guildid = ${interaction.guild.id}`);
            let warnkick = client.warnkick.get().settingValue;
            console.log(warnkick);
            let banneduserId = member.user.id;
            let bannedguildId = interaction.guild.id;
            let bannedtype = 'KICK';
            let bannedlength = 30;
            let bannedreason = `User Kicked for: ${reason}`;
            let bannedbanid = Math.floor(Math.random() * 9999999999) + 25;
            client.addBan = bansql.prepare("INSERT INTO bans (id, user, guild, reason, approved, appealed, date, length) VALUES (@id, @user, @guild, @reason, @approved, 'No', datetime('now'), @length);");
            score2 = { id: `${banneduserId}-${bannedbanid}`, user: banneduserId, guild: bannedguildId, reason: bannedreason, approved: bannedtype, length: bannedlength };
            const embed = new EmbedBuilder();
            embed.setColor("#00ff00")
            embed.setTitle(`**User Kicked** - ${member.user.username}`)
            embed.setTimestamp();
            embed.addFields(
                { name: 'Username', value: `${member.user.username}` },
                { name: 'Code', value: `${member.user.discriminator}`, inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: 'Reason:', value: `${reason}`, inline: true },
            )
            submitted.reply({ content: `User has been kicked: ${member.user.username}`, ephemeral: true, embeds: [embed] });
            //console.log(member);
            member.send(`You have been kicked from **${interaction.guild.name}**. for this reason: **${reason}**.`);
            client.addBan.run(score2);
            //member.kick(`User Kicked! - ${reason}`)






        }
    } catch (err) {
        console.log(err);
        interaction.followUp('There was an error seek support!');
    }
    }
}