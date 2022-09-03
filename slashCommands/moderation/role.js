const { EmbedBuilder, ApplicationCommandType } = require('discord.js');
const Discord = require('discord.js');
const SQLite = require("better-sqlite3");
const botsql = new SQLite(`./databases/bot.sqlite`);
const bansql = new SQLite(`./databases/bans.sqlite`);
const config = require(`../../configs/config.json`);
module.exports = {
    name: 'role',
    description: "Manage roles of the server or members.",
    cooldown: 3000,
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: 'ManageRoles', // permission required
    options: [
        {
            name: 'add',
            description: 'Add role to a user.',
            type: 1,
            options: [
                {
                    name: 'role',
                    description: 'The role you want to add to the user.',
                    type: 8,
                    required: true
                },
                {
                    name: 'user',
                    description: 'The user you want to add role to.',
                    type: 6,
                    required: true
                }
            ]
        },
        {
            name: 'remove',
            description: 'remove a role from a user.',
            type: 1,
            options: [
                {
                    name: 'role',
                    description: 'The role you want to add to the user.',
                    type: 8,
                    required: true
                },
                {
                    name: 'user',
                    description: 'The user you want to add role to.',
                    type: 6,
                    required: true
                }
            ]
        }
    ],
    run: async (client, interaction) => {
        client.setup = botsql.prepare(`SELECT * FROM settings WHERE guildid = '${interaction.guild.id}'`);
        if (!client.setup.all().length) {
            return interaction.editReply("The bot has not been configured yet, run /config to setup the bot.");
        }
        if (interaction.options._subcommand === 'add') {
            try {
                const member = interaction.guild.members.cache.get(interaction.options.get('user').value);
                const role = interaction.options.get('role').role;

                await member.roles.add(role.id);
                const embed = new EmbedBuilder()
                    .setTitle('Role Added')
                    .setDescription(`Successfully added the role: ${role} to ${member}`)
                    .setColor('Green')
                    .setTimestamp()
                    .setThumbnail(member.user.displayAvatarURL())
                    .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });

                return interaction.reply({ embeds: [embed] })
            } catch {
                client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
                return interaction.reply({ content: `Sorry, I failed adding that role to you!`, ephemeral: true });
            }

        }
        if (interaction.options._subcommand === 'remove') {
            try {
                const member = interaction.guild.members.cache.get(interaction.options.get('user').value);
                const role = interaction.options.get('role').role;
                await member.roles.remove(role.id);
                const embed = new EmbedBuilder()
                    .setTitle('Role Added')
                    .setDescription(`Successfully removed the role: ${role} to ${member}`)
                    .setColor('Green')
                    .setTimestamp()
                    .setThumbnail(member.user.displayAvatarURL())
                    .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });

                return interaction.reply({ embeds: [embed] })
            } catch (error) {
                console.log(error);
                client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
                return interaction.reply({ content: `Sorry, I failed removeing that role!`, ephemeral: true });
            }

        }
    }
};