const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Discord = require('discord.js');
const db = require('quick.db');
const SQLite = require("better-sqlite3");
const bansql = new SQLite(`./databases/bans.sqlite`);
const botsql = new SQLite(`./databases/bot.sqlite`);
const config = require(`../../configs/config.json`);
module.exports = {
    name: 'Warn user',
    cooldown: 3000,
    type: ApplicationCommandType.User,
    default_member_permissions: 'ModerateMembers', // permission required
    run: async (client, interaction) => {
        try {
            client.setup = botsql.prepare(`SELECT * FROM settings WHERE guildid = '${interaction.guild.id}'`);
            if (!client.setup.all().length) {
                return interaction.editReply("The bot has not been configured yet, run /config to setup the bot.");
            }
            const member = interaction.guild.members.cache.get(interaction.options.get('user').value);
            const modal = new ModalBuilder()
                .setCustomId('myModal')
                .setTitle(`Warning ${member.user.username}`);

            const ReasonInput = new TextInputBuilder()
                .setCustomId('ReasonInput')
                // The label is the prompt the user sees for this input
                .setLabel("Why are we warning the user?")
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
                client.warnkick = botsql.prepare(`SELECT warnkick FROM settings WHERE guildid = '${interaction.guild.id}'`);
                let warnkick = client.warnkick.get().warnkick;
                let banneduserId = member.user.id;
                let bannedguildId = interaction.guild.id;
                let bannedtype = 'WARNING';
                let bannedlength = 15;
                let bannedreason = `User Warned for: ${reason}`;
                let bannedbanid = Math.floor(Math.random() * 9999999999) + 25;
                client.addBan = bansql.prepare("INSERT INTO bans (id, user, guild, reason, approved, appealed, date, length) VALUES (@id, @user, @guild, @reason, @approved, 'No', datetime('now'), @length);");
                score2 = { id: `${banneduserId}-${bannedbanid}`, user: banneduserId, guild: bannedguildId, reason: bannedreason, approved: bannedtype, length: bannedlength };
                const KickCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'WARNING' AND user = ${member.user.id} AND guild = ${interaction.guild.id}`).all();
                //console.log(KickCount.length);

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
                submitted.reply({ content: `User has been warned: ${member.user.username}`, ephemeral: true, embeds: [embed] });
                //console.log(member);
                if (KickCount.length == 0) {
                    client.addBan.run(score2);
                    member.send(`You have been warned. for this reason: ${reason} | WARNING: ${KickCount.length + 1} /  ${warnkick}`);
                    //console.log("Kick is set to null add data.")
                    return;
                }
                else if (warnkick == 0 || warnkick == null) {
                    client.addBan.run(score2);
                    member.send(`You have been warned. for this reason: ${reason} | WARNING: ${KickCount.length + 1} /  ${warnkick}`);
                    //console.log("Kick is set to null add data.")
                    return;
                }
                else if (KickCount.length >= warnkick) {
                    member.timeout(timedout * 60 * 1000, `You were Warned ${KickCount.length} times within the last 15 days, you now have a 1 hour timeout`)
                    member.send(`You have been warned. for this reason: ${reason} | WARNING: ${KickCount.length + 1} /  ${warnkick}`);
                    // console.log("meets kick req");
                    return;

                } else {
                    //console.log("Adding Data");
                    await client.addBan.run(score2);
                    member.send(`You have been warned. for this reason: ${reason} | WARNING: ${KickCount.length + 1} /  ${warnkick}`);
                    return;
                }




            }
        } catch (err) {
            console.log(err);
            interaction.followUp('There was an error seek support!');
        }
    }
}

