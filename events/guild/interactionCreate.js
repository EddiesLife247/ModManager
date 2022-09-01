const { EmbedBuilder, Collection, PermissionsBitField } = require('discord.js');
const ms = require('ms');
const config = require('../../configs/config.json');
const SQLite = require("better-sqlite3");
const bansql = new SQLite(`./databases/bans.sqlite`);
const botsql = new SQLite(`./databases/bot.sqlite`);
const rrsql = new SQLite(`./databases/rr.sqlite`);
const cooldown = new Collection();
module.exports = async (client, interaction) => {
	const slashCommand = client.slashCommands.get(interaction.commandName);
	if (interaction.type == 4) {
		if (slashCommand.autocomplete) {
			const choices = [];
			await slashCommand.autocomplete(interaction, choices)
		}
	}
	if (!interaction.type == 2) return;




		// Button Interaction
	if (interaction.isButton()) {
		//console.log(interaction);
		// Get roles from database;
		client.getRr = rrsql.prepare("SELECT * FROM rrtable WHERE emoji = ?  AND guild = ? AND channel = ? AND messageid = ?");
		client.addRr = rrsql.prepare("INSERT OR REPLACE INTO rrtable (id, emoji, guild, role, messageid, channel) VALUES (@id, @emoji, @guild, @role, @messageid, @rrchan);");
		client.removeRr = rrsql.prepare("DELETE FROM rrtable WHERE emoji = ? AND guild = ? AND channel = ?");
		//console.log(reaction.message.id);
		//return;
		let rr;
		console.log(interaction.customId);
		rr = client.getRr.get(interaction.customId, interaction.guild.id, interaction.channel.id, interaction.message.id);
		if (rr) {
			if (interaction.member.roles.cache.some(role => role.id === `${rr.emoji}`)) {
				interaction.member.roles.remove(`${rr.emoji}`);
				interaction.reply({ content: `Successfully left <@&${rr.emoji}>!`, ephemeral: true });
			} else {
				interaction.member.roles.add(`${rr.emoji}`);
				interaction.reply({ content: `Successfully joined <@&${rr.emoji}>!`, ephemeral: true });
				console.log(`${interaction.user.tag} joined ${interaction.customId}!`);
			}
		} else {
			console.log(`Reaction Role does not exist in database, skipping!`);
		}
	}

	if (!slashCommand) return client.slashCommands.delete(interaction.commandName);
	try {
		if (slashCommand.cooldown) {
			if (cooldown.has(`slash-${slashCommand.name}${interaction.user.id}`)) return interaction.reply({ content: config.messages["COOLDOWN_MESSAGE"].replace('<duration>', ms(cooldown.get(`slash-${slashCommand.name}${interaction.user.id}`) - Date.now(), { long: true })) })
			if (slashCommand.userPerms || slashCommand.botPerms) {
				if (!interaction.memberPermissions.has(PermissionsBitField.resolve(slashCommand.userPerms || []))) {
					const userPerms = new EmbedBuilder()
						.setDescription(`🚫 ${interaction.user}, You don't have \`${slashCommand.userPerms}\` permissions to use this command!`)
						.setColor('Red')
					return interaction.reply({ embeds: [userPerms] })
				}
				if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(slashCommand.botPerms || []))) {
					const botPerms = new EmbedBuilder()
						.setDescription(`🚫 ${interaction.user}, I don't have \`${slashCommand.botPerms}\` permissions to use this command!`)
						.setColor('Red')
					return interaction.reply({ embeds: [botPerms] })
				}

			}

			await slashCommand.run(client, interaction);
			cooldown.set(`slash-${slashCommand.name}${interaction.user.id}`, Date.now() + slashCommand.cooldown)
			setTimeout(() => {
				cooldown.delete(`slash-${slashCommand.name}${interaction.user.id}`)
			}, slashCommand.cooldown)
		} else {
			if (slashCommand.userPerms || slashCommand.botPerms) {
				if (!interaction.memberPermissions.has(PermissionsBitField.resolve(slashCommand.userPerms || []))) {
					const userPerms = new EmbedBuilder()
						.setDescription(`🚫 ${interaction.user}, You don't have \`${slashCommand.userPerms}\` permissions to use this command!`)
						.setColor('Red')
					return interaction.reply({ embeds: [userPerms] })
				}
				if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(slashCommand.botPerms || []))) {
					const botPerms = new EmbedBuilder()
						.setDescription(`🚫 ${interaction.user}, I don't have \`${slashCommand.botPerms}\` permissions to use this command!`)
						.setColor('Red')
					return interaction.reply({ embeds: [botPerms] })
				}

			}
			await slashCommand.run(client, interaction);
		}
	} catch (error) {
		console.log(error);
	}
};