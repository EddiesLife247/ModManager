const { EmbedBuilder, ApplicationCommandType, PermissionsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
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
    default_member_permissions: 'ManageRoles', // permission required
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
                },
                {
                    name: 'text',
                    description: 'What text do you want to show?',
                    type: 3,
                    required: false,
                },
                {
                    name: 'emoji',
                    description: 'What emoji do you want to show?',
                    type: 3,
                    required: false,
                },
                {
                    name: 'colour',
                    description: 'What colour do you want to show?',
                    type: 3,
                    required: false,
                    choices: [
                        { name: "blue", value: "Primary" },
                        { name: "red", value: "Danger" },
                        { name: "grey", value: "Secondary" },
                        { name: "green", value: "Success" },
                    ],
                }
            ]
        },
        {
            name: 'del',
            description: 'Deletes a Reaction Role.',
            type: 1,
            options: [
                {
                    name: 'channel',
                    description: 'What is the channel that the reaction role embed is sent?',
                    type: 7,
                    required: true,
                },
                {
                    name: 'role',
                    description: 'The role you dont want to show anymore as a reaction role?',
                    type: 8,
                    required: true,
                }
            ]
        },
        {
            name: 'message',
            description: 'Update the reaction role message embed?',
            type: 1,
            options: [
                {
                    name: 'channel',
                    description: 'What channel is the message embed sent to? or is being sent to?',
                    type: 7,
                    required: true,
                }
            ]
        }
    ],
    run: async (client, interaction) => {
        if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            if (interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                var error = false;
                if (interaction.options._subcommand === 'add') {
                    try {
                        const channel = interaction.options.get('channel').channel;
                        const role = interaction.options.get('role').role;
                        const text = interaction.options.getString('text');
                        const chosenString = interaction.options.getString("colour");
                        const emoji = interaction.options.getString('emoji');

                        client.addRr = rrsql.prepare("INSERT OR REPLACE INTO rrtable (id, emoji, guild, role, messageid, channel, name, colour, emojichoice) VALUES (@id, @emoji, @guild, @role, @messageid, @rrchan, @name, @colour, @emojichoice);");

                        const getButtons = (toggle = false, choice) => {
                            if (text == null) {
                                txt = role.name;
                            } else {
                                txt = text;
                            }
                            //console.log(`${txt} - is now the name! (single)`)
                            const row = new ActionRowBuilder()
                            const button = new ButtonBuilder()
                                .setLabel(`${txt}`)
                                .setCustomId(`${role.id}`)
                                .setDisabled(false);
                            if (chosenString) {
                                button.setStyle(chosenString);
                            } else {
                                button.setStyle('Primary');
                            }
                            if (emoji) {
                                button.setEmoji(emoji);
                            }
                            row.addComponents(button);


                            return row;
                        }
                        client.getmsg = rrsql.prepare("SELECT * FROM rrmsg WHERE guild = ? AND channelid = ?")
                        const msgdata = client.getmsg.get(interaction.guild.id, channel.id);
                        const embed = new EmbedBuilder();
                        if (msgdata) {
                            embed.setTitle(msgdata.title)
                                .setDescription(msgdata.description)
                                .setColor(msgdata.colour)
                                .setTimestamp()
                                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                        } else {
                            embed.setTitle('Reaction Roles')
                                .setDescription(`The following button(s) grant's access to some of the servers roles!`)
                                .setColor('Green')
                                .setTimestamp()
                                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                                .addFields(
                                    { name: 'Adding a role:', value: `Want to get access to more features? click a button below to start!`, inline: false },
                                    { name: 'Removing a role:', value: `Don't want a role anymore? simply click the button to remove it!`, inline: false },
                                );
                        }


                        //send inital message, and grab id of the message for later
                        client.getRr = rrsql.prepare("SELECT * FROM rrtable WHERE guild = ? AND channel = ? ")
                        rr = client.getRr.all(interaction.guild.id, channel.id);
                        //console.log(`Length is: ${rr.length}`);
                        if (rr.length > 0) {
                            //console.log(`more than 1 reaction role`);
                            rr = client.getRr.get(interaction.guild.id, channel.id);
                            //console.log(rr);
                            if (!rr.messageid) {
                                return interaction.reply({ content: `There was an error, in finding the messageid!`, ephemeral: true });
                            }
                            msgid = rr.messageid;
                            score = { id: `${interaction.guild.id}-${role.id}`, emoji: role.id, guild: interaction.guild.id, role: role.id, messageid: rr.messageid, rrchan: channel.id, name: text, colour: chosenString, emojichoice: emoji };
                            await client.addRr.run(score);
                            //console.log(rr.messageid);
                            // get all the reaction roles for the message.
                            client.getRr = rrsql.prepare("SELECT * FROM rrtable WHERE guild = ? AND channel = ? AND messageid = ?")
                            const roleList = client.getRr.all(interaction.guild.id, channel.id, msgid);
                            //console.log(roleList);
                            //console.log(`getting rows, and adding to buttons`);
                            //We can still edit the message, and add the button, but only upto 25 roles.
                            const row = new ActionRowBuilder();
                            const row2 = new ActionRowBuilder();
                            const row3 = new ActionRowBuilder();
                            const row4 = new ActionRowBuilder();
                            const row5 = new ActionRowBuilder();

                            for (let i = 0; i < roleList.length; i++) {


                                var gotrole = interaction.guild.roles.cache.get(roleList[i].role);
                                var colour = roleList[i].colour;
                                var emojichoice = roleList[i].emojichoice;
                                //console.log(roleList[i].name);
                                if (roleList[i].name) {
                                    txt = roleList[i].name;
                                } else {
                                    txt = gotrole.name;
                                }
                                if (i >= 0 && i <= 4) {
                                    const button = new ButtonBuilder()
                                        .setLabel(`${txt}`)
                                        .setCustomId(`${gotrole.id}`)
                                        .setDisabled(false);
                                    if (colour) {
                                        button.setStyle(colour);
                                    } else {
                                        button.setStyle('Primary');
                                    }
                                    if (emojichoice) {
                                        button.setEmoji(emojichoice);
                                    }
                                    //console.log(button);
                                    row.addComponents(button);



                                }
                                if (i >= 5 && i <= 9) {
                                    const button = new ButtonBuilder()
                                        .setLabel(`${txt}`)
                                        .setCustomId(`${gotrole.id}`)
                                        .setDisabled(false);
                                    if (colour) {
                                        button.setStyle(colour);
                                    } else {
                                        button.setStyle('Primary');
                                    }
                                    if (emojichoice) {
                                        button.setEmoji(emojichoice);
                                    }
                                    //console.log(button);
                                    row2.addComponents(button);

                                }
                                if (i >= 10 && i <= 14) {
                                    const button = new ButtonBuilder()
                                        .setLabel(`${txt}`)
                                        .setCustomId(`${gotrole.id}`)
                                        .setDisabled(false);
                                    if (colour) {
                                        button.setStyle(colour);
                                    } else {
                                        button.setStyle('Primary');
                                    }
                                    if (emojichoice) {
                                        button.setEmoji(emojichoice);
                                    }
                                    //console.log(button);
                                    row3.addComponents(button);

                                }
                                if (i >= 15 && i <= 19) {
                                    const button = new ButtonBuilder()
                                        .setLabel(`${txt}`)
                                        .setCustomId(`${gotrole.id}`)
                                        .setDisabled(false);
                                    if (colour) {
                                        button.setStyle(colour);
                                    } else {
                                        button.setStyle('Primary');
                                    }
                                    if (emojichoice) {
                                        button.setEmoji(emojichoice);
                                    }
                                    //console.log(button);
                                    row4.addComponents(button);

                                }
                                if (i >= 20 && i <= 24) {
                                    const button = new ButtonBuilder()
                                        .setLabel(`${txt}`)
                                        .setCustomId(`${gotrole.id}`)
                                        .setDisabled(false);
                                    if (colour) {
                                        button.setStyle(colour);
                                    } else {
                                        button.setStyle('Primary');
                                    }
                                    if (emojichoice) {
                                        button.setEmoji(emojichoice);
                                    }
                                    //console.log(button);
                                    row5.addComponents(button);

                                }
                            }
                            for (let i = 0; i < roleList.length; i++) {

                                if (i >= 0 && i <= 4) {
                                    //console.log('1 row of buttons');
                                    channel.messages.fetch(`${msgid}`).then(message => {
                                        //console.log(getAllButtons());
                                        message.edit({ embeds: [embed], components: [row] }).then(btnmsg => {
                                            //console.log(btnmsg);
                                            //console.log(`message edited! with id: ${msgid}`);


                                        });
                                    }).catch(err => {
                                        console.error(err);
                                        error = true;
                                        client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
                                        return interaction.followUp({ content: `An Error occured!`, ephemeral: true });
                                    });
                                }
                                else if (i >= 5 && i <= 9) {
                                    //console.log('2 rows of buttons');
                                    channel.messages.fetch(`${msgid}`).then(message => {
                                        //console.log(getAllButtons());
                                        message.edit({ embeds: [embed], components: [row, row2] }).then(btnmsg => {
                                            //console.log(btnmsg);
                                            //console.log(`message edited! with id: ${msgid}`);


                                        });
                                    }).catch(err => {
                                        console.error(err);
                                        error = true;
                                        client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
                                        return interaction.followUp({ content: `An Error occured!`, ephemeral: true });
                                    });
                                }
                                else if (i >= 10 && i <= 14) {
                                    // console.log('3 rows of buttons');
                                    channel.messages.fetch(`${msgid}`).then(message => {
                                        //console.log(getAllButtons());
                                        message.edit({ embeds: [embed], components: [row, row2, row3] }).then(btnmsg => {
                                            //console.log(`message edited! with id: ${msgid}`);


                                        });
                                    }).catch(err => {
                                        console.error(err);
                                        error = true;
                                        client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
                                        return interaction.followUp({ content: `An Error occured!`, ephemeral: true });
                                    });
                                }
                                else if (i >= 15 && i <= 19) {
                                    // console.log('4 rows of buttons');
                                    channel.messages.fetch(`${msgid}`).then(message => {
                                        //console.log(getAllButtons());
                                        message.edit({ embeds: [embed], components: [row, row2, row3, row4] }).then(btnmsg => {
                                            //console.log(`message edited! with id: ${msgid}`);


                                        });
                                    }).catch(err => {
                                        console.error(err);
                                        error = true;
                                        client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
                                        return interaction.followUp({ content: `An Error occured!`, ephemeral: true });
                                    });
                                }
                                else if (i >= 20 && i <= 24) {
                                    // console.log('5 rows of buttons');
                                    channel.messages.fetch(`${msgid}`).then(message => {
                                        //console.log(getAllButtons());
                                        message.edit({ embeds: [embed], components: [row, row2, row3, row4, row5] }).then(btnmsg => {
                                            //console.log(`message edited! with id: ${msgid}`);


                                        });
                                    }).catch(err => {
                                        console.error(err);
                                        error = true;
                                        return interaction.followUp({ content: `An Error occured!`, ephemeral: true });
                                    });
                                } else {
                                    return interaction.reply({ content: `A Maximum of 25 Roles maybe added`, ephemeral: true });
                                }
                            }
                        } else {
                            client.getmsg = rrsql.prepare("SELECT * FROM rrmsg WHERE guild = ? AND channelid = ?")
                            const msgdata = client.getmsg.get(interaction.guild.id, channel.id);
                            if (msgdata) {
                                channel.messages.fetch(`${msgdata.messageid}`).then(message => {
                                    //console.log(getAllButtons());
                                    msgid = message.id;
                                    //console.log(`Editing message: ${msgdata.messageid}`);
                                    message.edit({ embeds: [embed], components: [getButtons()] }).then(btnmsg => {
                                        score = { id: `${interaction.guild.id}-${role.id}`, emoji: role.id, guild: interaction.guild.id, role: role.id, messageid: msgid, rrchan: channel.id, name: text, colour: chosenString, emojichoice: emoji };
                                        client.addRr.run(score);
                                        return interaction.followUp({ content: `Your reaction role has been added!`, ephemeral: true });
                                    });
                                });
                            } else {


                                channel.send({ embeds: [embed] }).then(msg => {
                                    //add the reaction role to the database for looking up later
                                    msgid = msg.id;
                                    //console.log(msg);
                                    score = { id: `${interaction.guild.id}-${role.id}`, emoji: role.id, guild: interaction.guild.id, role: role.id, messageid: msgid, rrchan: channel.id, name: text, colour: chosenString, emojichoice: emoji };
                                    client.addRr.run(score);

                                    // get all reaction roles for that message.
                                    //console.log('first message, in channel so adding button to reaction role.')
                                    client.getRr = rrsql.prepare("SELECT * FROM rrtable WHERE guild = ? AND channel = ? AND messageid = ?")
                                    rr = client.getRr.get(interaction.guild.id, channel.id, msg.id);
                                    //console.log(rr);
                                    //edit the message with the new buttons.
                                    channel.messages.fetch(`${msgid}`).then(message => {
                                        message.edit({ embeds: [embed], components: [getButtons()] }).then(btnmsg => {
                                            //console.log(`msg sent, with msg id: ${msgid}`);

                                            //console.log(btnmsg);
                                            return interaction.followUp({ content: `Your reaction role has been added!`, ephemeral: true });

                                        });
                                    }).catch(err => {
                                        console.log(err);
                                        return interaction.followUp({ content: `An Error occured!`, ephemeral: true });
                                    });

                                });
                            }
                        }
                        return interaction.reply({ content: `Your reaction role has been added!`, ephemeral: true });
                    } catch (error) {
                        console.log(error);
                        client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${error.message} | \`\`\` ${error.stack} \`\`\`` });
                        return interaction.reply({ content: `Sorry, I failed to add the reaction role!`, ephemeral: true });
                    }

                }
                if (interaction.options._subcommand === 'del') {
                    const channel = interaction.options.get('channel').channel;
                    const role = interaction.options.get('role').role;
                    //console.log(channel.id);
                    //console.log(role.id);
                    client.delRr = rrsql.prepare("DELETE FROM rrtable WHERE guild = ? AND emoji = ? AND channel = ?")
                    client.getRr = rrsql.prepare("SELECT * FROM rrtable WHERE guild = ? AND emoji = ? AND channel = ?")
                    rr = client.getRr.all(interaction.guild.id, role.id, channel.id);
                    //console.log(rr);
                    //console.log(`Length is: ${rr.length}`);
                    if (rr.length > 0) {
                        // console.log(`more than 1 reaction role`);
                        rr = client.getRr.get(interaction.guild.id, role.id, channel.id);
                        //console.log(rr);
                        if (!rr.messageid) {
                            return interaction.reply({ content: `There was an error, in finding the messageid!`, ephemeral: true });
                        }
                        msgid = rr.messageid;
                        await client.delRr.run(interaction.guild.id, rr.emoji, rr.channel);
                        //console.log(rr.messageid);
                        // get all the reaction roles for the message.
                        client.getRr = rrsql.prepare("SELECT * FROM rrtable WHERE guild = ? AND channel = ? AND messageid = ?")
                        const roleList = client.getRr.all(interaction.guild.id, channel.id, msgid);
                        //console.log(roleList);
                        //console.log(`getting rows, and adding to buttons`);
                        //We can still edit the message, and add the button, but only upto 25 roles.
                        const row = new ActionRowBuilder();
                        const row2 = new ActionRowBuilder();
                        const row3 = new ActionRowBuilder();
                        const row4 = new ActionRowBuilder();
                        const row5 = new ActionRowBuilder();
                        client.getmsg = rrsql.prepare("SELECT * FROM rrmsg WHERE guild = ? AND channelid = ?")
                        const msgdata = client.getmsg.get(interaction.guild.id, channel.id);
                        const embed = new EmbedBuilder();
                        if (msgdata) {
                            embed.setTitle(msgdata.title)
                                .setDescription(msgdata.description)
                                .setColor(msgdata.colour)
                                .setTimestamp()
                                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                        } else {
                            embed.setTitle('Reaction Roles')
                                .setDescription(`The following button(s) Grant's access to some of the servers roles!`)
                                .setColor('Green')
                                .setTimestamp()
                                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                                .addFields(
                                    { name: 'Adding a role:', value: `Want to get access to more features? click a button below to start!`, inline: false },
                                    { name: 'Removing a role:', value: `Don't want a role anymore? simply click the button to remove it!`, inline: false },
                                );
                        }


                        for (let i = 0; i < roleList.length; i++) {
                            var gotrole = interaction.guild.roles.cache.get(roleList[i].role);
                            //console.log(roleList[i].name);
                            if (roleList[i].name) {
                                txt = roleList[i].name;
                            } else {
                                txt = gotrole.name;
                            }
                            var colour = roleList[i].colour;
                            var emojichoice = roleList[i].emojichoice;
                            if (i >= 0 && i <= 4) {
                                const button = new ButtonBuilder()
                                    .setLabel(`${txt}`)
                                    .setCustomId(`${gotrole.id}`)
                                    .setDisabled(false);
                                if (colour) {
                                    button.setStyle(colour);
                                } else {
                                    button.setStyle('Primary');
                                }
                                if (emojichoice) {
                                    button.setEmoji(emojichoice);
                                }
                                //console.log(button);
                                row.addComponents(button);



                            }
                            if (i >= 5 && i <= 9) {
                                const button = new ButtonBuilder()
                                    .setLabel(`${txt}`)
                                    .setCustomId(`${gotrole.id}`)
                                    .setDisabled(false);
                                if (colour) {
                                    button.setStyle(colour);
                                } else {
                                    button.setStyle('Primary');
                                }
                                if (emojichoice) {
                                    button.setEmoji(emojichoice);
                                }
                                //console.log(button);
                                row2.addComponents(button);

                            }
                            if (i >= 10 && i <= 14) {
                                const button = new ButtonBuilder()
                                    .setLabel(`${txt}`)
                                    .setCustomId(`${gotrole.id}`)
                                    .setStyle('Primary')
                                    .setDisabled(false)
                                //console.log(button);
                                row3.addComponents(button);

                            }
                            if (i >= 15 && i <= 19) {
                                const button = new ButtonBuilder()
                                    .setLabel(`${txt}`)
                                    .setCustomId(`${gotrole.id}`)
                                    .setDisabled(false);
                                if (colour) {
                                    button.setStyle(colour);
                                } else {
                                    button.setStyle('Primary');
                                }
                                if (emojichoice) {
                                    button.setEmoji(emojichoice);
                                }
                                //console.log(button);
                                row4.addComponents(button);

                            }
                            if (i >= 20 && i <= 24) {
                                const button = new ButtonBuilder()
                                    .setLabel(`${txt}`)
                                    .setCustomId(`${gotrole.id}`)
                                    .setDisabled(false);
                                if (colour) {
                                    button.setStyle(colour);
                                } else {
                                    button.setStyle('Primary');
                                }
                                if (emojichoice) {
                                    button.setEmoji(emojichoice);
                                }
                                //console.log(button);
                                row5.addComponents(button);

                            }
                        }
                        for (let i = 0; i < roleList.length; i++) {
                            if (i == null) {
                                channel.messages.fetch(`${msgid}`).then(message => {
                                    message.delete();
                                });
                            }
                            if (i >= 0 && i <= 4) {
                                // console.log('1 row of buttons');
                                channel.messages.fetch(`${msgid}`).then(message => {
                                    //console.log(getAllButtons());
                                    message.edit({ embeds: [embed], components: [row] }).then(btnmsg => {
                                        //console.log(btnmsg);
                                      //  console.log(`message edited! with id: ${msgid}`);


                                    });
                                }).catch(err => {
                                    console.error(err);
                                    error = true;
                                    client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
                                    return interaction.followUp({ content: `An Error occured!`, ephemeral: true });
                                });
                            }
                            else if (i >= 5 && i <= 9) {
                                //console.log('2 rows of buttons');
                                channel.messages.fetch(`${msgid}`).then(message => {
                                    //console.log(getAllButtons());
                                    message.edit({ embeds: [embed], components: [row, row2] }).then(btnmsg => {
                                        //console.log(btnmsg);
                                       // console.log(`message edited! with id: ${msgid}`);


                                    });
                                }).catch(err => {
                                    console.error(err);
                                    error = true;
                                    client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
                                    return interaction.followUp({ content: `An Error occured!`, ephemeral: true });
                                });
                            }
                            else if (i >= 10 && i <= 14) {
                                //console.log('3 rows of buttons');
                                channel.messages.fetch(`${msgid}`).then(message => {
                                    //console.log(getAllButtons());
                                    message.edit({ embeds: [embed], components: [row, row2, row3] }).then(btnmsg => {
                                        //console.log(`message edited! with id: ${msgid}`);


                                    });
                                }).catch(err => {
                                    console.error(err);
                                    error = true;
                                    return interaction.followUp({ content: `An Error occured!`, ephemeral: true });
                                });
                            }
                            else if (i >= 15 && i <= 19) {
                                //console.log('4 rows of buttons');
                                channel.messages.fetch(`${msgid}`).then(message => {
                                    //console.log(getAllButtons());
                                    message.edit({ embeds: [embed], components: [row, row2, row3, row4] }).then(btnmsg => {
                                       // console.log(`message edited! with id: ${msgid}`);


                                    });
                                }).catch(err => {
                                    console.error(err);
                                    error = true;
                                    client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
                                    return interaction.followUp({ content: `An Error occured!`, ephemeral: true });
                                });
                            }
                            else if (i >= 20 && i <= 24) {
                                // console.log('5 rows of buttons');
                                channel.messages.fetch(`${msgid}`).then(message => {
                                    //console.log(getAllButtons());
                                    message.edit({ embeds: [embed], components: [row, row2, row3, row4, row5] }).then(btnmsg => {
                                        //console.log(`message edited! with id: ${msgid}`);


                                    });
                                }).catch(err => {
                                    console.error(err);
                                    error = true;
                                    client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
                                    return interaction.followUp({ content: `An Error occured!`, ephemeral: true });
                                });
                            } else {
                                return interaction.reply({ content: `A Maximum of 25 Roles maybe added`, ephemeral: true });
                            }
                        }
                        return interaction.reply({ content: `Your reaction role has been removed!`, ephemeral: true });
                    }
                }
                if (interaction.options._subcommand === 'message') {
                    try {
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
                            .setLabel('What hex code colour should your embed be?')
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
                            client.getmsg = rrsql.prepare("SELECT * FROM rrmsg WHERE guild = ? AND channelid = ?")
                            const msgdata = client.getmsg.get(interaction.guild.id, channel.id);
                            const embed = new EmbedBuilder()
                                .setTitle(title)
                                .setDescription(description)
                                .setColor(colour)
                                .setTimestamp()
                            //console.log(msgdata);
                            if (msgdata) {
                                if (msgdata.channelid = channel) {
                                    client.addRr = rrsql.prepare("UPDATE rrmsg SET colour = ?, title = ?, description = ? WHERE guild = ? AND channelid = ?;");
                                    //console.log(msgdata.messageid);
                                    //.log(channel.messages);
                                    channel.messages.fetch(`${msgdata.messageid}`).then(message => {
                                        //console.log(getAllButtons());
                                       // console.log(`Editing message: ${msgdata.messageid}`);
                                        message.edit({ embeds: [embed] })
                                        client.addRr.run(colour, title, description, interaction.guild.id, channel.id);
                                        //console.log('message edited!');
                                    });


                                    submitted.reply({ content: `Your embed message has been updated in: ${channel.name}, and will be used for future reaction roles`, ephemeral: true });
                                } else {
                                    client.addRr = rrsql.prepare("INSERT OR REPLACE INTO rrmsg (id, guild, channelid, messageid, colour, title, description) VALUES (@id, @guild, @channelid, @messageid, @colour, @title, @description);");
                                    channel.send({ embeds: [embed] }).then(msg => {
                                        //add the reaction role to the database for looking up later
                                        msgid = msg.id;
                                        //console.log(msg);
                                        score = { id: `${interaction.guild.id}-${channel.id}`, guild: interaction.guild.id, channelid: channel.id, messageid: msgid, colour: colour, title: title, description: description };
                                        client.addRr.run(score);
                                    });
                                    submitted.reply({ content: `Your embed message has been sent in: ${channel.name}, and will be used for future reaction roles`, ephemeral: true });

                                }
                            } else {
                                client.addRr = rrsql.prepare("INSERT OR REPLACE INTO rrmsg (id, guild, channelid, messageid, colour, title, description) VALUES (@id, @guild, @channelid, @messageid, @colour, @title, @description);");
                                channel.send({ embeds: [embed] }).then(msg => {
                                    //add the reaction role to the database for looking up later
                                    msgid = msg.id;
                                    //console.log(msg);
                                    score = { id: `${interaction.guild.id}-${channel.id}`, guild: interaction.guild.id, channelid: channel.id, messageid: msgid, colour: colour, title: title, description: description };
                                    client.addRr.run(score);
                                });
                                submitted.reply({ content: `Your embed message has been sent in: ${channel.name}, and will be used for future reaction roles`, ephemeral: true });
                            }
                        }
                    } catch (err) {
                        console.log(err);
                        interaction.reply('AN Error occured!');
                    }
                }
            } else {
                interaction.reply({content: `Sorry, you don't seem to have permission to use this command!`, ephemeral: true});
            }

        } else {
            interaction.reply({ content: `Sorry, I don't have enough permissions to mange roles, run /botcheck for more info!`, ephemeral: true });
        }
    }
}