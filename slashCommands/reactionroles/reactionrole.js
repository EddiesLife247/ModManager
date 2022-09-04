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
                },
                {
                    name: 'text',
                    description: 'What text do you want to show?',
                    type: 3,
                    required: false,
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
                    description: 'The channel where the reaction role message is?',
                    type: 7,
                    required: true,
                },
                {
                    name: 'role',
                    description: 'The role you dont want to show',
                    type: 8,
                    required: true,
                }
            ]
        }
    ],
    run: async (client, interaction) => {
        if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            var error = false;
            if (interaction.options._subcommand === 'add') {
                try {
                    const channel = interaction.options.get('channel').channel;
                    const role = interaction.options.get('role').role;
                    const text = interaction.options.getString('text');
                    //console.log(text);
                    client.addRr = rrsql.prepare("INSERT OR REPLACE INTO rrtable (id, emoji, guild, role, messageid, channel, name) VALUES (@id, @emoji, @guild, @role, @messageid, @rrchan, @name);");

                    const getButtons = (toggle = false, choice) => {
                        if (text == null) {
                            txt = role.name;
                        } else {
                            txt = text;
                        }
                        console.log(`${txt} - is now the name! (single)`)
                        const row = new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setLabel(`${txt}`)
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
                        score = { id: `${interaction.guild.id}-${role.id}`, emoji: role.id, guild: interaction.guild.id, role: role.id, messageid: rr.messageid, rrchan: channel.id, name: text };
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
                            console.log(roleList[i].name);
                            if (!roleList[i].name == null) {
                                txt = roleList[i].name;
                            } else {
                                txt = gotrole.name;
                            }
                            console.log(`${txt} - is now the name!`)
                            if (i >= 0 && i <= 4) {
                                const button = new ButtonBuilder()
                                    .setLabel(`${txt}`)
                                    .setCustomId(`${gotrole.id}`)
                                    .setStyle('Primary')
                                    .setDisabled(false)
                                //console.log(button);
                                row.addComponents(button);



                            }
                            if (i >= 5 && i <= 9) {
                                const button = new ButtonBuilder()
                                    .setLabel(`${txt}`)
                                    .setCustomId(`${gotrole.id}`)
                                    .setStyle('Primary')
                                    .setDisabled(false)
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
                                    .setStyle('Primary')
                                    .setDisabled(false)
                                //console.log(button);
                                row4.addComponents(button);

                            }
                            if (i >= 20 && i <= 24) {
                                const button = new ButtonBuilder()
                                    .setLabel(`${txt}`)
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
                                    client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
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
                                    client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
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
                                    client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
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
                                    client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
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
                            score = { id: `${interaction.guild.id}-${role.id}`, emoji: role.id, guild: interaction.guild.id, role: role.id, messageid: msgid, rrchan: channel.id, name: text };
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
                    client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${error.message} | \`\`\` ${error.stack} \`\`\`` });
                    return interaction.reply({ content: `Sorry, I failed to add the reaction role!`, ephemeral: true });
                }

            }
            if (interaction.options._subcommand === 'del') {
                const channel = interaction.options.get('channel').channel;
                const role = interaction.options.get('role').role;
                console.log(channel.id);
                console.log(role.id);
                client.delRr = rrsql.prepare("DELETE FROM rrtable WHERE guild = ? AND emoji = ? AND channel = ?")
                client.getRr = rrsql.prepare("SELECT * FROM rrtable WHERE guild = ? AND emoji = ? AND channel = ?")
                rr = client.getRr.all(interaction.guild.id, role.id, channel.id);
                console.log(rr);
                console.log(`Length is: ${rr.length}`);
                if (rr.length > 0) {
                    console.log(`more than 1 reaction role`);
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
                    console.log(`getting rows, and adding to buttons`);
                    //We can still edit the message, and add the button, but only upto 25 roles.
                    const row = new ActionRowBuilder();
                    const row2 = new ActionRowBuilder();
                    const row3 = new ActionRowBuilder();
                    const row4 = new ActionRowBuilder();
                    const row5 = new ActionRowBuilder();
                    const embed = new EmbedBuilder()
                        .setTitle('Choose a reaction role')
                        .setDescription(`Choose a button below to get access to that role.`)
                        .setColor('Green')
                        .setTimestamp()
                        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });
                        

                    for (let i = 0; i < roleList.length; i++) {
                        console.log(roleList[i].name);
                        if (roleList[i].name == null) {
                            txt = roleList[i].name;
                        } else {
                            txt = gotrole.name;
                        }
                        var gotrole = interaction.guild.roles.cache.get(roleList[i].role);
                        if (i >= 0 && i <= 4) {
                            const button = new ButtonBuilder()
                                .setLabel(`${txt}`)
                                .setCustomId(`${gotrole.id}`)
                                .setStyle('Primary')
                                .setDisabled(false)
                            //console.log(button);
                            row.addComponents(button);



                        }
                        if (i >= 5 && i <= 9) {
                            const button = new ButtonBuilder()
                                .setLabel(`${txt}`)
                                .setCustomId(`${gotrole.id}`)
                                .setStyle('Primary')
                                .setDisabled(false)
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
                                .setStyle('Primary')
                                .setDisabled(false)
                            //console.log(button);
                            row4.addComponents(button);

                        }
                        if (i >= 20 && i <= 24) {
                            const button = new ButtonBuilder()
                                .setLabel(`${txt}`)
                                .setCustomId(`${gotrole.id}`)
                                .setStyle('Primary')
                                .setDisabled(false)
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
                                client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
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
                                client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
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
                                client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
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
                                client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
                                return interaction.reply({ content: `An Error occured!`, ephemeral: true });
                            });
                        } else {
                            return interaction.reply({ content: `A Maximum of 25 Roles maybe added`, ephemeral: true });
                        }
                    }
                    return interaction.reply({ content: `Your reaction role has been removed!`, ephemeral: true });
                }
            }
        } else {
            interaction.reply({ content: `Sorry, I don't have enough permissions to mange roles, run /botcheck for more info!`, ephemeral: true });
        }
    }

}