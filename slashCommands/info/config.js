const { EmbedBuilder, ApplicationCommandType, PermissionsBitField } = require('discord.js');
const Discord = require('discord.js');
const SQLite = require("better-sqlite3");
const botsql = new SQLite(`./databases/bot.sqlite`);
const bansql = new SQLite(`./databases/bans.sqlite`);
const config = require(`../../configs/config.json`);
module.exports = {
	name: 'config',
	description: 'Configure the bot database',
	cooldown: 3000,
	type: ApplicationCommandType.ChatInput,
	default_member_permissions: 'ManageGuild',
	options: [
		{
			name: 'setting',
			description: 'Change a setting.',
			type: 1,
			options: [
				{
					name: 'modchannel',
					description: 'The channel where moderator notices goes to',
					type: 7,
				},
				{
					name: 'logchannel',
					description: 'The channel where audit logs goes to',
					type: 7,
				},
				{
					name: 'warnkick',
					description: 'How many warnings before we kick a user?',
					type: 4,
				},
				{
					name: 'kickban',
					description: 'How many kicks before we ban a user?',
					type: 4,
				},
				{
					name: 'acceptedtrust',
					description: 'What trust level should we accept people at? (23 is best)',
					type: 4,
				},
				{
					name: 'messagefilter',
					description: 'Should we moderate messages for swearwords?',
					type: 5,
				},
				{
					name: 'invitefilter',
					description: 'Should we moderate messages for invites?',
					type: 5,
				},
				{
					name: 'globalbans',
					description: 'Should we ban the user if they are global banned in our databse?',
					type: 5,
				},
			]
		}
	],
	run: async (client, interaction) => {
		client.addSetting = botsql.prepare(`INSERT INTO settings (guildid) VALUES ('${interaction.guild.id}');`);
		client.settings = botsql.prepare(`SELECT * FROM settings WHERE guildid = '${interaction.guild.id}'`);
        if (!client.settings.all().length) {
			
			client.addSetting.run();
			console.log(`Added Guild Config: ${interaction.guild.id}`)
		}
		if (interaction.options._subcommand === 'setting') {
			try {
				if (interaction.options.get('modchannel')) {
					if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) {
						const modchannel = interaction.options.get('modchannel').channel;
						if (botsql.exec(`UPDATE settings SET 'modchannel' = '${modchannel.id}' WHERE guildid = '${interaction.guild.id}'`)) {
							interaction.reply({ content: `Moderator Log channel has been updated successfully`, ephemeral: true });
						} else {
							return interaction.reply({ content: `ERROR: An error occured!`, ephemeral: true });
							
						}
					} else {
						return interaction.reply({ content: `ERROR: I don't have enough permissions to send messages`, ephemeral: true });
					}
				}

				if (interaction.options.get('logchannel')) {
					if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
						const logchannel = interaction.options.get('logchannel').channel;
						if (botsql.exec(`UPDATE settings SET 'logchannel' = ${logchannel.id} WHERE guildid = '${interaction.guild.id}';`)) {
							interaction.reply({ content: `Audit Log channel has been updated successfully`, ephemeral: true });
						} else {
							return interaction.reply({ content: `ERROR: An error occured!`, ephemeral: true });
						}
					} else {
						return interaction.reply({ content: `ERROR: I don't have enough permissions to View the audit log`, ephemeral: true });
					}

				}
				if (interaction.options.get('warnkick')) {
					if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
						const warnkick = interaction.options.get('warnkick').value;
						if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
							if (botsql.exec(`UPDATE settings SET 'warnkick' = ${warnkick} WHERE guildid = '${interaction.guild.id}'`)) {
								interaction.reply({ content: `I will now kick after a user has recieved: ${warnkick} warnings.`, ephemeral: true });
							} else {
								return interaction.reply({ content: `ERROR: An error occured!`, ephemeral: true });
							}
						}
	
					} else {
						interaction.reply({ content: `ERROR, I don't have enough permissions to Kick messages!`, ephemeral: true });
					}
				}
				if (interaction.options.get('acceptedtrust')) {
					if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
						const acceptedtrust = interaction.options.get('acceptedtrust').value;
						if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
							if (botsql.exec(`UPDATE settings SET 'acceptedtrust' = ${acceptedtrust} WHERE guildid = '${interaction.guild.id}';`)) {
								interaction.reply({ content: `I will now kick after a user if they don't get this trust level or more: ${acceptedtrust} score.`, ephemeral: true });
							} else {
								return interaction.reply({ content: `ERROR: An error occured!`, ephemeral: true });
							}
						}
	
					} else {
						interaction.reply({ content: `ERROR, I don't have enough permissions to Kick messages!`, ephemeral: true });
					}
				}
				if (interaction.options.get('kickban')) {
					if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
						const kickban = interaction.options.get('kickban').value;
						if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
							if (botsql.exec(`UPDATE settings SET 'kickban' = ${kickban} WHERE guildid = '${interaction.guild.id}';`)) {
								interaction.reply({ content: `I will now kick after a user has recieved: ${kickban} warnings.`, ephemeral: true });
							} else {
								return interaction.reply({ content: `ERROR: An error occured!`, ephemeral: true });
							}
						}
	
					} else {
						interaction.reply({ content: `ERROR, I don't have enough permissions to Kick messages!`, ephemeral: true });
					}
				}
				if (interaction.options.get('messagefilter')) {
					if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
						const messagefilter = interaction.options.get('messagefilter').value;
						if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
							if (botsql.exec(`UPDATE settings SET 'messagefilter' = ${messagefilter} WHERE guildid = '${interaction.guild.id}';`)) {
								interaction.reply({ content: `Message filter is now set to: ${messagefilter}.`, ephemeral: true });
							} else {
								return interaction.reply({ content: `ERROR: An error occured!`, ephemeral: true });
							}
						}
					} else {
						interaction.reply({ content: `ERROR, I don't have enough permissions to manage messages!`, ephemeral: true });
					}
				}
				if (interaction.options.get('globalbans')) {
					if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
						const globalbans = interaction.options.get('globalbans').value;
						if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
							if (botsql.exec(`UPDATE settings SET 'globalbans' = ${globalbans} WHERE guildid = '${interaction.guild.id}';`)) {
								interaction.reply({ content: `Global Bans are now set to: ${globalbans}.`, ephemeral: true });
							} else {
								return interaction.reply({ content: `ERROR: An error occured!`, ephemeral: true });
							}
						}
					} else {
						interaction.reply({ content: `ERROR, I don't have enough permissions to manage messages!`, ephemeral: true });
					}
				}
				if (interaction.options.get('invitefilter')) {
					if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
						const invitefilter = interaction.options.get('invitefilter').value;
						if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
							if (botsql.exec(`UPDATE settings SET 'invitefilter' = ${invitefilter} WHERE guildid = '${interaction.guild.id}';`)) {
								interaction.reply({ content: `Invite filter is now set to: ${invitefilter}.`, ephemeral: true });
							} else {
								return interaction.reply({ content: `ERROR: An error occured!`, ephemeral: true });
							}
						}
					} else {
						interaction.reply({ content: `ERROR, I don't have enough permissions to manage messages!`, ephemeral: true });
					}
				}


			} catch (err) {
				console.log(err);
				interaction.reply(`There was an error, seek support!`);
			}
		}

	}
}