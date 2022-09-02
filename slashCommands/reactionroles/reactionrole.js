const { EmbedBuilder, ApplicationCommandType, PermissionsBitField, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const Discord = require('discord.js');
const db = require('quick.db');
const SQLite = require("better-sqlite3");
const botsql = new SQLite(`./databases/bot.sqlite`);
const rrsql = new SQLite(`./databases/rr.sqlite`);
module.exports = {
    name: 'reactionrole',
    description: 'Manage Reaction Role',
    cooldown: 3000,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'add',
            description: 'Add a Reaction Role.',
            type: 1,
            options: [
                {
                    name: 'channel',
                    description: 'The channel where you want the role to be chosen?',
                    type: 7,
                    required: true,
                },
                {
                    name: 'role',
                    description: 'The role we need to assign to the user',
                    type: 8,
                    required: true,
                }
            ]
        }
    ],
    run: async (client, interaction) => {
        var error = false;
        client.logchannel = botsql.prepare(`SELECT settings.settingValue FROM settings WHERE setting = 'logchannel' AND guildid = '${interaction.guild.id}'`);
        const logchannel = interaction.guild.channels.cache.get(client.logchannel.get().settingValue);
        if (interaction.options._subcommand === 'add') {
            try {
                
                const channel = interaction.options.get('channel').channel;
                const role = interaction.options.get('role').role;
                client.addRr = rrsql.prepare("INSERT OR REPLACE INTO rrtable (id, emoji, guild, role, messageid, channel) VALUES (@id, @emoji, @guild, @role, @messageid, @rrchan);");

                const getButtons = (toggle = false, choice) => {
                    const row = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setLabel(`${role.name}`)
                            .setCustomId(`${role.id}`)
                            .setStyle(toggle == true && choice == 'blue' ? 'Secondary' : 'Primary')
                            .setDisabled(toggle),
                    );

                    return row;
                }

                const embed = new EmbedBuilder()
                    .setTitle('Choose a reaction role')
                    .setDescription(`Choose a button below to get access to that role.`)
                    .setColor('Green')
                    .setTimestamp()
                    .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });



                //send inital message, and grab id of the message for later
                client.getRr = rrsql.prepare("SELECT * FROM rrtable WHERE guild = ? AND channel = ? ")
                rr = client.getRr.all(interaction.guild.id, channel.id);
                console.log(`Length is: ${rr.length}`);
                if (rr.length > 0) {
                    console.log(`more than 1 reaction role`);
                    rr = client.getRr.get(interaction.guild.id, channel.id);
                    //console.log(rr);
                    if (!rr.messageid) {
                        return interaction.reply({ content: `There was an error, in finding the messageid!`, ephemeral: true });
                    }
                    msgid = rr.messageid;
                    score = { id: `${interaction.guild.id}-${role.id}`, emoji: role.id, guild: interaction.guild.id, role: role.id, messageid: rr.messageid, rrchan: channel.id };
                    await client.addRr.run(score);
                    //console.log(rr.messageid);
                    // get all the reaction roles for the message.
                    client.getRr = rrsql.prepare("SELECT * FROM rrtable WHERE guild = ? AND channel = ? AND messageid = ?")
                    const roleList = client.getRr.all(interaction.guild.id, channel.id, msgid);
                    //console.log(roleList);
                    console.log(`getting rows, and adding to buttons`);
                    //We can still edit the message, and add the button, but only upto 25 roles.
                    const row = new ActionRowBuilder();
                    const row2 = new ActionRowBuilder();
                    const row3 = new ActionRowBuilder();
                    const row4 = new ActionRowBuilder();
                    const row5 = new ActionRowBuilder();

                    for (let i = 0; i < roleList.length; i++) {
                        var gotrole = interaction.guild.roles.cache.get(roleList[i].role);
                        if (i >= 0 && i <= 4) {
                            const button = new ButtonBuilder()
                                .setLabel(`${gotrole.name}`)
                                .setCustomId(`${gotrole.id}`)
                                .setStyle('Primary')
                                .setDisabled(false)
                            //console.log(button);
                            row.addComponents(button);



                        }
                        if (i >= 5 && i <= 9) {
                            const button = new ButtonBuilder()
                                .setLabel(`${gotrole.name}`)
                                .setCustomId(`${gotrole.id}`)
                                .setStyle('Primary')
                                .setDisabled(false)
                            //console.log(button);
                            row2.addComponents(button);

                        }
                        if (i >= 10 && i <= 14) {
                            const button = new ButtonBuilder()
                                .setLabel(`${gotrole.name}`)
                                .setCustomId(`${gotrole.id}`)
                                .setStyle('Primary')
                                .setDisabled(false)
                            //console.log(button);
                            row3.addComponents(button);

                        }
                        if (i >= 15 && i <= 19) {
                            const button = new ButtonBuilder()
                                .setLabel(`${gotrole.name}`)
                                .setCustomId(`${gotrole.id}`)
                                .setStyle('Primary')
                                .setDisabled(false)
                            //console.log(button);
                            row4.addComponents(button);

                        }
                        if (i >= 20 && i <= 24) {
                            const button = new ButtonBuilder()
                                .setLabel(`${gotrole.name}`)
                                .setCustomId(`${gotrole.id}`)
                                .setStyle('Primary')
                                .setDisabled(false)
                            //console.log(button);
                            row5.addComponents(button);

                        }
                    }
                    for (let i = 0; i < roleList.length; i++) {

                        if (i >= 0 && i <= 4) {
                            console.log('1 row of buttons');
                            channel.messages.fetch(`${msgid}`).then(message => {
                                //console.log(getAllButtons());
                                message.edit({ embeds: [embed], components: [row] }).then(btnmsg => {
                                    //console.log(btnmsg);
                                    console.log(`message edited! with id: ${msgid}`);


                                });
                            }).catch(err => {
                                console.error(err);
                                error = true;
                                return interaction.reply({ content: `An Error occured!`, ephemeral: true });
                            });
                        }
                        else if (i >= 5 && i <= 9) {
                            console.log('2 rows of buttons');
                            channel.messages.fetch(`${msgid}`).then(message => {
                                //console.log(getAllButtons());
                                message.edit({ embeds: [embed], components: [row, row2] }).then(btnmsg => {
                                    //console.log(btnmsg);
                                    console.log(`message edited! with id: ${msgid}`);


                                });
                            }).catch(err => {
                                console.error(err);
                                error = true;
                                return interaction.reply({ content: `An Error occured!`, ephemeral: true });
                            });
                        }
                        else if (i >= 10 && i <= 14) {
                            console.log('3 rows of buttons');
                            channel.messages.fetch(`${msgid}`).then(message => {
                                //console.log(getAllButtons());
                                message.edit({ embeds: [embed], components: [row, row2, row3] }).then(btnmsg => {
                                    console.log(`message edited! with id: ${msgid}`);


                                });
                            }).catch(err => {
                                console.error(err);
                                error = true;
                                return interaction.reply({ content: `An Error occured!`, ephemeral: true });
                            });
                        }
                        else if (i >= 15 && i <= 19) {
                            console.log('4 rows of buttons');
                            channel.messages.fetch(`${msgid}`).then(message => {
                                //console.log(getAllButtons());
                                message.edit({ embeds: [embed], components: [row, row2, row3, row4] }).then(btnmsg => {
                                    console.log(`message edited! with id: ${msgid}`);


                                });
                            }).catch(err => {
                                console.error(err);
                                error = true;
                                return interaction.reply({ content: `An Error occured!`, ephemeral: true });
                            });
                        }
                        else if (i >= 20 && i <= 24) {
                            console.log('5 rows of buttons');
                            channel.messages.fetch(`${msgid}`).then(message => {
                                //console.log(getAllButtons());
                                message.edit({ embeds: [embed], components: [row, row2, row3, row4, row5] }).then(btnmsg => {
                                    console.log(`message edited! with id: ${msgid}`);


                                });
                            }).catch(err => {
                                console.error(err);
                                error = true;
                                return interaction.reply({ content: `An Error occured!`, ephemeral: true });
                            });
                        } else {
                            return interaction.reply({ content: `A Maximum of 25 Roles maybe added`, ephemeral: true });
                        }
                    }
                } else {
                    channel.send({ embeds: [embed] }).then(msg => {
                        //add the reaction role to the database for looking up later
                        msgid = msg.id;
                        //console.log(msg);
                        score = { id: `${interaction.guild.id}-${role.id}`, emoji: role.id, guild: interaction.guild.id, role: role.id, messageid: msgid, rrchan: channel.id };
                        client.addRr.run(score);

                        // get all reaction roles for that message.
                        console.log('first message, in channel so adding button to reaction role.')
                        client.getRr = rrsql.prepare("SELECT * FROM rrtable WHERE guild = ? AND channel = ? AND messageid = ?")
                        rr = client.getRr.get(interaction.guild.id, channel.id, msg.id);
                        console.log(rr);
                        //edit the message with the new buttons.
                        channel.messages.fetch(`${msgid}`).then(message => {
                            message.edit({ embeds: [embed], components: [getButtons()] }).then(btnmsg => {
                                console.log(`msg sent, with msg id: ${msgid}`);

                                //console.log(btnmsg);
                                return interaction.reply({ content: `Your reaction role has been added!`, ephemeral: true });

                            });
                        }).catch(err => {
                            console.error(err);
                            return interaction.reply({ content: `An Error occured!`, ephemeral: true });
                        });

                    });
                }
                return interaction.reply({ content: `Your reaction role has been added!`, ephemeral: true });
            } catch (error) {
                console.log(error);
                return interaction.reply({ content: `Sorry, I failed to add the reaction role!`, ephemeral: true });
            }

        }
    }
}