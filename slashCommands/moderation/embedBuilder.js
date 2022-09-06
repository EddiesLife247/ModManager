const { EmbedBuilder, ApplicationCommandType, PermissionsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Discord = require('discord.js');
const db = require('quick.db');
const SQLite = require("better-sqlite3");
const botsql = new SQLite(`./databases/bot.sqlite`);
const emdssql = new SQLite(`./databases/embeds.sqlite`);
module.exports = {
    name: 'embedbuilder',
    description: 'Allows moderators to send and manage Message Embeds to channels /help embedbuilder',
    cooldown: 3000,
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: 'ManageMessages', // permission required
    options: [
        {
            name: 'message',
            description: 'Manage the Main message data',
            type: 1,
            options: [
                {
                    name: 'channel',
                    description: 'The channel where you want the role to be chosen?',
                    type: 7,
                    required: true,
                },
            ]
        },
        {
            name: 'fields',
            description: 'Manage the fields on an embed.',
            type: 2,
            options: [
                {
                    name: 'add',
                    description: 'Add a field to an embed?',
                    type: 1,
                    required: true,
                    options: [
                        {
                            name: 'messageid',
                            description: 'What was the embed that was sent?',
                            type: 3,
                            required: true,
                        },
                    ]
                },
                {
                    name: 'remove',
                    description: 'Remove a field from an embed?',
                    type: 1,
                    required: true,
                    options: [
                        {
                            name: 'messageid',
                            description: 'What was the embed that was sent?',
                            type: 3,
                            required: true,
                        },
                    ]
                }
            ]
        },
    ],
    run: async (client, interaction) => {
        try {
            console.log(interaction.guild);
            if (interaction.guild.id == '787871047139328000') {
                const input = new ModalBuilder()
                .setCustomId('reactionrolemessage')
                .setTitle('Configure your Reaction Role Message');

            const titleInput = new TextInputBuilder()
                .setCustomId('title')
                .setLabel('What should the embed be titled?')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            const colourInput = new TextInputBuilder()
                .setCustomId('colour')
                .setLabel('What colour the embed be?')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            const descriptionInput = new TextInputBuilder()
                .setCustomId('description')
                .setLabel('What should the main text be?')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const firstActionRow = new ActionRowBuilder().addComponents(titleInput);
            const secondActionRow = new ActionRowBuilder().addComponents(colourInput);
            const thirdActionRow = new ActionRowBuilder().addComponents(descriptionInput);

            input.addComponents(firstActionRow, secondActionRow, thirdActionRow);

            await interaction.showModal(input);
            const submitted = await interaction.awaitModalSubmit({
                // Timeout after a minute of not receiving any valid Modals
                time: 600000,
                // Make sure we only accept Modals from the User who sent the original Interaction we're responding to
                filter: i => i.user.id === interaction.user.id,
            }).catch(error => {
                // Catch any Errors that are thrown (e.g. if the awaitModalSubmit times out after 60000 ms)
                console.error(error)
                return null
            })
            if (submitted) {
                //client.addRr = rrsql.prepare("INSERT OR REPLACE INTO rrmsg (id, guild, channelid, messageid, colour, title, description) VALUES (@id, @guild, @channelid, @messageid, @colour, @title, @description);");
                const colour = submitted.fields.getTextInputValue('colour');
                const title = submitted.fields.getTextInputValue('title');
                const description = submitted.fields.getTextInputValue('description');
                const channel = interaction.options.get('channel').channel;
                client.getmsg = emdssql.prepare("SELECT * FROM rrmsg WHERE guild = ? AND channelid = ?")
                const msgdata = client.getmsg.get(interaction.guild.id, channel.id);
                const embed = new EmbedBuilder()
                    .setTitle(title)
                    .setDescription(description)
                    .setColor(colour)
                    .setTimestamp()
                console.log(msgdata);
                if (msgdata) {
                    if (msgdata.channelid = channel) {
                        client.addRr = emdssql.prepare("UPDATE rrmsg SET colour = ?, title = ?, description = ? WHERE guild = ? AND channelid = ?;");
                    }
                }
            }
            } else {
                interaction.reply({content: 'You have found a spoiler! - This command is still being developed! - Disabled command, sorry', ephemeral: true});
                return;
                
            }
        } catch (error) {
            console.log(error);
            client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${error.message} | \`\`\` ${error.stack} \`\`\`` });
        }
    }
}