const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Discord = require('discord.js');
const SQLite = require("better-sqlite3");
const bansql = new SQLite(`./databases/bans.sqlite`);
const botsql = new SQLite(`./databases/bot.sqlite`);
const config = require(`../../configs/config.json`);
require('dotenv').config()
module.exports = {
    name: 'admin',
    description: 'Administration Commnads',
    cooldown: 3000,
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: 'ManageMessages', // permission required
    options: [
        {
            name: 'cmd',
            description: 'Admin Command',
            type: 3,
            required: true,
        },
    ],
    run: async (client, interaction) => {
        if (interaction.guild.id == '787871047139328000') {
            if (interaction.channel.id == '901905815810760764') {
                console.log(interaction.options.get('cmd').value);
                var cmd = interaction.options.get('cmd').value;
                var cmdargs = cmd.split(' ');
                console.log(cmdargs[0]);
                if (cmd == 'restart bot') {
                    resetBot(interaction, client);
                }
                if (cmd == 'refresh punishments') {
                    const top10 = bansql.prepare("SELECT * FROM 'bans'").all();
                    for (const data of top10) {
                        // Check each ban against the current data.
                        var lengthleft = data.length - 1;
                        console.log(`Checking if ${data.user} needs to be removed from Punishment Database DUE TO FORCE UPDATE`);
                        if (lengthleft == 0) {
                            bansql.prepare(`DELETE FROM 'bans' WHERE ID = '${data.id}'`).run()
                            console.log(`${data.user} deleted.`)
                            client.guilds.cache.get("787871047139328000").channels.cache.get("1017361857528483880").send(`Ban on ${data.user} has expired in our database.`);
                        } else {
                            bansql.prepare(`UPDATE 'bans' SET length = '${lengthleft}' WHERE ID = '${data.id}'`).run()
                            console.log(`${data.user} now has ${lengthleft} days left.`)
                            client.guilds.cache.get("787871047139328000").channels.cache.get("1017361857528483880").send(`Entry on ${data.user} now has ${lengthleft} day(s) left of their ${data.approved} entry.`);
                        }
                    }
                    interaction.reply({ content: `Updated Punishment Database`, ephemeral: true });
                }
                if (cmd == 'list servers') {
                    const embed = new Discord.MessageEmbed()
                        .setTitle('**ALL DISCORD SERVERS**')
                        .setColor("#ff33ff")
                        .setFooter(interaction.channel.guild.name, interaction.guild.iconURL())
                    client.guilds.cache.forEach(guild => {
                        embed.addField(`${guild.name}`, `${guild.id}`, true)
                    })
                    interaction.reply({ embeds: [embed] });
                    return;
                }
                if (cmdargs[0] == 'leaveserver') {
                    try {
                        client.guilds.cache.get(cmdargs[1]).leave()
                            .catch(err => {
                                console.log(`there was an error leaving the guild: \n ${err.message}`);
                            })
                            interaction.reply(`I have now left: ${cmdargs[1]}.`)
                        return;
                    } catch (err) {
                        console.log(err);
                        interaction.reply(`There was an error! - ${err}`)
                        return
                    }
                }
                if (cmdargs[0] == 'invite') {
                    console.log('invite requested');
                    try {
                        let guilddata = client.guilds.cache.get(cmdargs[1]);
                        //console.log(guilddata);
                        const channel = guilddata.channels.cache.filter(m => m.type === 'GUILD_TEXT').first();
                        //console.log(channel);
                        await channel.createInvite({})
                            .then(async (invite) => {
                                interaction.reply(`Invite for: ${cmdargs[1]} is: ${invite.url}`); // push invite link and guild name to array
                            })
                            .catch((error) => console.log(error));

                        return
                    } catch (err) {
                        console.log(err);
                        interaction.reply(`There was an error! - ${err}`)
                        return
                    }
                }
                

            } else {
                interaction.reply({ content: `This command is reservered for Mod Manager Developers only. Sorry`, ephemeral: true });
            }
        } else {
            interaction.reply({ content: `This command is reservered for Mod Manager Developers only. Sorry`, ephemeral: true });
        }
    }
}
function resetBot(interaction, client) {
    // send channel a message that you're resetting bot [optional]
    interaction.reply({ content: `Bot Restarting....`, ephemeral: true })
        .then(msg => client.destroy())
        .then(() => client.login(process.env.TOKEN));
}