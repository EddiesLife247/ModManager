const { EmbedBuilder, ApplicationCommandType, PermissionsBitField } = require('discord.js');
const Discord = require('discord.js');
const db = require('quick.db');
const SQLite = require("better-sqlite3");
const botsql = new SQLite(`./databases/bot.sqlite`);
module.exports = {
	name: 'config',
	description: 'Configure the bot database',
	cooldown: 3000,
	type: ApplicationCommandType.ChatInput,
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
					name: 'messagefilter',
					description: 'Should we moderate messages for swearwords?',
					type: 5,
				},
				{
					name: 'invitefilter',
					description: 'Should we moderate messages for invites?',
					type: 5,
				}
			]
		}
	],
	run: async (client, interaction) => {
		client.addSetting = botsql.prepare("INSERT INTO settings (guildid, setting, settingValue) VALUES (?, ?, ?);");
		client.updateSetting = botsql.prepare("UPDATE settings SET settingValue = ? WHERE setting = ?;");
		client.settings = botsql.prepare(`SELECT settings.settingValue FROM settings WHERE setting = ? AND guildid = ${interaction.guild.id}`);
		if (interaction.options._subcommand === 'setting') {
			try {
				if (interaction.options.get('modchannel')) {
					const modchannel = interaction.options.get('modchannel').channel;
					try {
						const check = client.settings.get('modchannel').settingValue;
						console.log(modchannel.id);
						if (client.settings.get('modchannel').settingValue) {
							// already in database.
							if (client.updateSetting.run(`${modchannel.id}`, 'modchannel')) {
								interaction.reply({ content: `Moderator Log channel has been updated successfully`, ephemeral: true });
							} else {
								interaction.reply({ content: `There was an error changing the config, contact support`, ephemeral: true });
							}
						}
					} catch (err) {
						settingName = 'modchannel';
						settingValue = modchannel.id;
						if (client.addSetting.run(interaction.guild.id, settingName, settingValue)) {
							interaction.reply({ content: `Moderator Log channel has been updated successfully`, ephemeral: true });
						} else {
							interaction.reply({ content: `There was an error changing the config, contact support`, ephemeral: true });
							console.log('Error Reported');
							console.log(err);
						}
					}
				}

				if (interaction.options.get('logchannel')) {
					const logchannel = interaction.options.get('logchannel').channel;
					console.log(logchannel.id);
					try {
						const check = client.settings.get('logchannel').settingValue;
						// already indatabase.
						if (client.updateSetting.run(`${logchannel.id}`, 'logchannel')) {
							interaction.reply({ content: `Moderator Log channel has been updated successfully, make sure I have the "View Audit Log Permissions"`, ephemeral: true });
						} else {
							interaction.reply({ content: `There was an error changing the config, contact support`, ephemeral: true });
							console.log('Error Reported');
							console.log(err);
						}

					} catch (err) {
						//console.log(err);
						settingName = 'logchannel';
						settingValue = logchannel.id;
						if (client.addSetting.run(interaction.guild.id, settingName, settingValue)) {
							interaction.reply({ content: `Moderator Log channel has been updated successfully, make sure I have the "View Audit Log Permissions"`, ephemeral: true });
						} else {
							interaction.reply({ content: `There was an error changing the config, contact support`, ephemeral: true });
							console.log('Error Reported');
							console.log(err);
						}
					}

				}
				if (interaction.options.get('warnkick')) {
					const warnkick = interaction.options.get('warnkick').value;
					console.log(interaction.options.get('warnkick').value);
					try {
						const check = client.settings.get('warnkick').settingValue;
						// already in database.
						if (client.updateSetting.run(`${warnkick}`, 'warnkick')) {
							interaction.reply({ content: `I will now kick a user after they have recieved: ${warnkick} warnings.`, ephemeral: true });
						} else {
							interaction.reply({ content: `There was an error changing the config, contact support`, ephemeral: true });
							console.log('Error Reported');
							console.log(err);
						}

					} catch (err) {
						settingName = 'warnkick';
						settingValue = warnkick;
						if (client.addSetting.run(interaction.guild.id, settingName, settingValue)) {
							interaction.reply({ content: `I will now kick a user after they have recieved: ${warnkick} warnings.`, ephemeral: true });
						} else {
							interaction.reply({ content: `There was an error changing the config, contact support`, ephemeral: true });
							console.log('Error Reported');
							console.log(err);
						}
					}
				}
				if (interaction.options.get('messagefilter')) {
					const messagefilter = interaction.options.get('messagefilter').value;
					console.log(interaction.options.get('messagefilter').value);
					try {
						const check = client.settings.get('messagefilter').settingValue;
						// already in database.
						if (client.updateSetting.run(`${messagefilter}`, 'messagefilter')) {
							interaction.reply({ content: `Message filter is now: ${messagefilter}.`, ephemeral: true });
						} else {
							interaction.reply({ content: `There was an error changing the config, contact support`, ephemeral: true });
							console.log('Error Reported');
							console.log(err);
						}

					} catch (err) {
						settingName = 'messagefilter';
						settingValue = messagefilter;
						if (client.addSetting.run(interaction.guild.id, settingName, settingValue)) {
							interaction.reply({ content: `Message filter is now: ${messagefilter}.`, ephemeral: true });
						} else {
							interaction.reply({ content: `There was an error changing the config, contact support`, ephemeral: true });
							console.log('Error Reported');
							console.log(err);
						}
					}
				}
				if (interaction.options.get('invitefilter')) {
					const inviteFilter = interaction.options.get('invitefilter').value;
					console.log(interaction.options.get('invitefilter').value);
					try {
						const check = client.settings.get('invitefilter').settingValue;
						// already in database.
						if (client.updateSetting.run(`${inviteFilter}`, 'inviteFilter')) {
							interaction.reply({ content: `Invite filter is now: ${inviteFilter}.`, ephemeral: true });
						} else {
							interaction.reply({ content: `There was an error changing the config, contact support`, ephemeral: true });
							console.log('Error Reported');
							console.log(err);
						}

					} catch (err) {
						settingName = 'invitefilter';
						settingValue = inviteFilter;
						if (client.addSetting.run(interaction.guild.id, settingName, settingValue)) {
							interaction.reply({ content: `Invite filter is now: ${inviteFilter}.`, ephemeral: true });
						} else {
							interaction.reply({ content: `There was an error changing the config, contact support`, ephemeral: true });
							console.log('Error Reported');
							console.log(err);
						}
					}
				}


			} catch (err) {
				console.log(err);
				interaction.reply(`There was an error, seek support!`);
			}
		}

	}
}