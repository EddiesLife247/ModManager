const { EmbedBuilder, ApplicationCommandType, PermissionsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, SelectMenuBuilder, SelectMenuComponent, SelectMenuOptionBuilder } = require('discord.js');
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
                {
                    name: 'messageid',
                    description: 'If Updating what is the message id of the original embed sent by me?',
                    type: 3,
                    required: false,
                },
                {
                    name: 'thumbnailurl',
                    description: 'What thumbnail do you want to use in the embed?',
                    type: 3,
                    required: false,
                },
                {
                    name: 'timestamp',
                    description: 'True/False do you want to show a timestamp?',
                    type: 3,
                    required: false,
                    choices: [
                        { name: "true", value: "1" },
                        { name: "false", value: "0" },
                    ]
                },
            ]
        },
        {
            name: 'fields',
            description: 'Manage the fields on an embed.',
            type: 2,
            options: [
                {
                    name: 'addfield',
                    description: 'Add a field to an embed?',
                    type: 1,
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
                    name: 'removefield',
                    description: 'Remove a field from an embed?',
                    type: 1,
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
            //console.log(interaction.guild);
            if (interaction.guild.id == '787871047139328000') {
                if (interaction.options._subcommand === 'message') {
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
                    const urlInput = new TextInputBuilder()
                        .setCustomId('urlInput')
                        .setLabel('Should we set this as a link?')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false);
                    const footerInput = new TextInputBuilder()
                        .setCustomId('footer')
                        .setLabel('What should the footer say?')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false);



                    const firstActionRow = new ActionRowBuilder().addComponents(titleInput);
                    const secondActionRow = new ActionRowBuilder().addComponents(colourInput);
                    const thirdActionRow = new ActionRowBuilder().addComponents(descriptionInput);
                    const forthActionRow = new ActionRowBuilder().addComponents(urlInput);
                    const fifthActionRow = new ActionRowBuilder().addComponents(footerInput);

                    input.addComponents(firstActionRow, secondActionRow, thirdActionRow, forthActionRow, fifthActionRow);

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
                        var url = '';
                        var timestamp = '0';
                        var thumbnail = '';
                        var footer = '';
                        var messageid = '';
                        //client.addRr = rrsql.prepare("INSERT OR REPLACE INTO rrmsg (id, guild, channelid, messageid, colour, title, description) VALUES (@id, @guild, @channelid, @messageid, @colour, @title, @description);");
                        const colour = submitted.fields.getTextInputValue('colour');
                        const title = submitted.fields.getTextInputValue('title');
                        const description = submitted.fields.getTextInputValue('description');
                        const row = new ActionRowBuilder()
                        //console.log(submitted.fields)
                        if (submitted.fields.getTextInputValue('urlInput')) {
                            url = submitted.fields.getTextInputValue('urlInput').value;
                        }
                        if (interaction.options.get('timestamp')) {
                            timestamp = interaction.options.get('timestamp').value;
                        }
                        if (submitted.fields.getTextInputValue('footer')) {
                            footer = submitted.fields.getTextInputValue('footer');
                            console.log(footer);
                        }
                        //console.log(interaction.options.get('thumbnailurl'));
                        if (interaction.options.get('thumbnailurl')) {
                            
                            thumbnail = interaction.options.get('thumbnailurl').value;
                        }
                        const channel = interaction.options.get('channel').channel;
                        if (interaction.options.get('messageid')) {
                            messageid = interaction.options.get('messageid').value;
                        }
                        client.getmsg = emdssql.prepare("SELECT * FROM embeds WHERE guild = ? AND channelid = ? AND messageid = ?")
                        const msgdata = client.getmsg.get(interaction.guild.id, channel.id, messageid);
                        //console.log(description);
                        const embed = new EmbedBuilder()
                            .setTitle(title)
                            .setColor(colour)
                        if (timestamp == '1') {
                            embed.setTimestamp();
                        }
                        if (description) {
                            embed.setDescription(description);
                        }
                        if (!footer == '') {
                            embed.setFooter({text: footer, iconURL: interaction.guild.iconURL()});
                        }
                        console.log(url);
                        if (!url == '') {
                            embed.setURL(url);
                            console.log(url);
                        }
                        console.log(thumbnail);
                        if (!thumbnail == '') {
                            embed.setThumbnail(thumbnail);
                        }
                        //console.log(msgdata);

                        if (msgdata) {
                            if (msgdata.channelid = channel.id) {
                                if (msgdata.messageid = messageid) {
                                    client.updateEmbed = emdssql.prepare("UPDATE embeds SET colour = ?, title = ?, description = ?, url = ?, thumbnail = ?, footer = ?, timestamp = ? WHERE guild = ? AND channelid = ? AND messageid = ?;");
                                    channel.messages.fetch(`${msgdata.messageid}`).then(message => {
                                        message.edit({ embeds: [embed] })
                                        client.updateEmbed.run(colour, title, description, url, thumbnail, footer, timestamp, interaction.guild.id, channel.id, msgdata.messageid);
                                    });

                                    submitted.reply({ content: `Your embed message has been updated in: ${channel.name}, and will be used for future reaction roles`, ephemeral: true });
                                } else {
                                    submitted.reply({ content: `Error: the message with id: ${messageid}, does not appear in our database, are you sure we sent it?`, ephemeral: true });
                                }

                            } else {
                                submitted.reply({ content: `Error: the message in channel: ${channel.name} does not appear in our database, are you sure we sent it?`, ephemeral: true });
                            }
                        } else {
                            //send the  embed.
                            client.addEmbed = emdssql.prepare("INSERT OR REPLACE INTO embeds (id, guild, channelid, messageid, colour, title, description, author, thumbnail, footer, timestamp) VALUES (@id, @guild, @channelid, @messageid, @colour, @title, @description, @author, @thumbnail, @footer, @timestamp);");
                            channel.send({ embeds: [embed] }).then(msg => {
                                //add the reaction role to the database for looking up later
                                msgid = msg.id;
                                //console.log(msg);
                                score = { id: `${interaction.guild.id}-${channel.id}`, guild: interaction.guild.id, channelid: channel.id, messageid: msgid, colour: colour, title: title, description: description, url: url, thumbnail: thumbnail, footer: footer, timestamp: timestamp };
                                client.addEmbed.run(score);
                            });
                            submitted.reply({ content: `Your embed message has been sent in: ${channel.name}, and will be used for future reaction roles`, ephemeral: true });
                        }
                    }
                }
                console.log(interaction.options._subcommand);
                if (interaction.options._subcommand === 'addfield') {
                    interaction.reply({ content: 'add a field', ephemeral: true })
                } else if (interaction.options._subcommand === 'removefield') {
                    interaction.reply({ content: 'remove a field', ephemeral: true })
                }
            } else {
                interaction.reply({ content: 'You have found a spoiler! - This command is still being developed! - Disabled command, sorry', ephemeral: true });
                return;

            }
        } catch (error) {
            console.log(error);
            client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${error.message} | \`\`\` ${error.stack} \`\`\`` });
        }
    }
}