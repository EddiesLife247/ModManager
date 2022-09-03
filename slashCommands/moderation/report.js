const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Discord = require('discord.js');
const db = require('quick.db');
const SQLite = require("better-sqlite3");
const bansql = new SQLite(`./databases/bans.sqlite`);
const botsql = new SQLite(`./databases/bot.sqlite`);
const config = require(`../../configs/config.json`);
module.exports = {
    name: 'Report',
    cooldown: 3000,
    type: ApplicationCommandType.Message,
    //default_member_permissions: 'BanMembers', // permission required
    run: async (client, interaction) => {
        client.setup = botsql.prepare(`SELECT * FROM settings WHERE guildid = '${interaction.guild.id}'`);
        if (!client.setup.all().length) {
            return interaction.editReply("The bot has not been configured yet, run /config to setup the bot.");
        }
        //console.log(interaction);
        const modal = new ModalBuilder()
            .setCustomId('myModal')
            .setTitle(`Report to Moderators`);

        const ReasonInput = new TextInputBuilder()
            .setCustomId('ReasonInput')
            // The label is the prompt the user sees for this input
            .setLabel("Why are we reporting this message?")
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
            //console.log(reason);
            try {
                client.modchannel = botsql.prepare(`SELECT modchannel FROM settings WHERE guildid = '${interaction.guild.id}'`);
                const channel = interaction.guild.channels.cache.get(client.modchannel.get().modchannel);
                const embed = new EmbedBuilder();
                embed.setColor("#00ff00")
                embed.setTitle(`**User Message Report**`)
                embed.setTimestamp();
                embed.addFields(
                    { name: 'Reporter:', value: `${interaction.user.username}`, inline: true},
                    { name: 'Message Author:', value: `${interaction.targetMessage.author.username}`, inline: true },
                    { name: 'Message Content:', value: `${interaction.targetMessage.content}`, inline: false },
                    { name: 'Reason:', value: `${reason}`, inline: false },
                )
                embed.setURL(`https://discord.com/channels/${interaction.guild.id}/${interaction.targetMessage.channelId}/${interaction.targetMessage.id}`);
                channel.send({content: `A User has reported a message for: ${reason}`, embeds: [embed]});
                submitted.reply({ content: `Your message has been reported to moderators`, ephemeral: true });
            } catch (err) {
                console.log("Server Setup Incorrectly. For Report.js File");
                console.log(err);
                submitted.reply({ content: `Your message failed to send to the moderators, due to an error. Please contact the moderator team via the help channel.`, ephemeral: true });
            }
        }
    }
}