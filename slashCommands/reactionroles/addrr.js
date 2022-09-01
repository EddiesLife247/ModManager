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

        if (interaction.options._subcommand === 'add') {
            try {
                const channel = interaction.guild.channels.cache.get(interaction.options.get('channel').value);
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
                rr = client.getRr.get(interaction.guild.id, interaction.channel.id);
                if (rr) {
                    msgid = rr.messageid;
                    score = { id: `${interaction.guild.id}-${role.id}`, emoji: role.id, guild: interaction.guild.id, role: role.id, messageid: msgid, rrchan: channel.id };
                    await client.addRr.run(score);
                    // get all the reaction roles for the message.
                    client.getRr = rrsql.prepare("SELECT * FROM rrtable WHERE guild = ? AND channel = ? AND messageid = ?")
                    const roleList = client.getRr.all(interaction.guild.id, interaction.channel.id, msgid);
                    //console.log(roleList);
                    const getAllButtons = (toggle = false, choice) => {
                        for (let i = 0; i < roleList.length; i++) {
                            //console.log(roleList[i]);
                            //console.log("====");
                            var gotrole = interaction.guild.roles.cache.get(roleList[i].role);
                            const row = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setLabel(`${gotrole.name}`)
                                    .setCustomId(`${gotrole.id}`)
                                    .setStyle(toggle == true && choice == 'blue' ? 'Secondary' : 'Primary')
                                    .setDisabled(toggle),
                            );
                            return row;
                        }
                        console.log(row[i]);
                    }
                    console.log(msgid);
                    channel.messages.fetch(`${msgid}`).then(message => {
                        console.log(getAllButtons());
                        message.edit({ embeds: [embed], components: [getAllButtons()] }).then(btnmsg => {
                            //console.log(btnmsg);
                            return interaction.reply({ content: `Your reaction role has been added!`, ephemeral: true });

                        });
                    }).catch(err => {
                        console.error(err);
                        return interaction.reply({ content: `An Error occured!`, ephemeral: true });
                    });
                    



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
                        rr = client.getRr.get(interaction.guild.id, interaction.channel.id, msg.id);
                        console.log(rr);
                        //edit the message with the new buttons.
                        channel.messages.fetch(`${msgid}`).then(message => {
                            message.edit({ embeds: [embed], components: [getButtons()] }).then(btnmsg => {
                                
                                console.log(btnmsg);
                                return interaction.reply({ content: `Your reaction role has been added!`, ephemeral: true });

                            });
                        }).catch(err => {
                            console.error(err);
                            return interaction.reply({ content: `An Error occured!`, ephemeral: true });
                        });
                        
                    });
                }
            } catch (error) {
                console.log(error);
                return interaction.reply({ content: `Sorry, I failed to add the reaction role!`, ephemeral: true });
            }

        }

    }
}