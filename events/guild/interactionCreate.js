const { EmbedBuilder, Collection, PermissionsBitField } = require('discord.js');
const ms = require('ms');
const config = require('../../configs/config.json');
const SQLite = require("better-sqlite3");
const bansql = new SQLite(`./databases/bans.sqlite`);
const botsql = new SQLite(`./databases/bot.sqlite`);
const rrsql = new SQLite(`./databases/rr.sqlite`);
const cooldown = new Collection();
module.exports = async (client, interaction) => {
	client.logchannel = botsql.prepare(`SELECT logchannel FROM settings WHERE guildid = '${interaction.guild.id}'`);
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
		client.getBan = bansql.prepare("SELECT * FROM BANS WHERE id = ?");
		banid = interaction.customId;
		banid = banid.slice(0, -5);
		if(client.getBan.get(banid)) {
			console.log('BAN DENY');
		}
		banid = banid.slice(0, -7);
		if(client.getBan.get(banid)) {
			console.log('BAN APPROVED');
		}
		console.log(interaction.customId);

		if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
			//console.log(interaction);
			// Get roles from database;
			client.getRr = rrsql.prepare("SELECT * FROM rrtable WHERE emoji = ?  AND guild = ? AND channel = ? AND messageid = ?");
			client.addRr = rrsql.prepare("INSERT OR REPLACE INTO rrtable (id, emoji, guild, role, messageid, channel) VALUES (@id, @emoji, @guild, @role, @messageid, @rrchan);");
			client.removeRr = rrsql.prepare("DELETE FROM rrtable WHERE emoji = ? AND guild = ? AND channel = ?");
			//console.log(reaction.message.id);
			//return;
			let rr;
			//console.log(interaction.customId);
			rr = client.getRr.get(interaction.customId, interaction.guild.id, interaction.channel.id, interaction.message.id);
			if (rr) {
				console.log(`Someone used the reaction buttons on: ${interaction.guild.name}.`);
				if (interaction.member.roles.cache.some(role => role.id === `${rr.emoji}`)) {
					interaction.member.roles.remove(`${rr.emoji}`);
					interaction.reply({ content: `Successfully left <@&${rr.emoji}>!`, ephemeral: true });
					role = 'LEFT ROLE VIA REACTION ROLES';

				} else {
					interaction.member.roles.add(`${rr.emoji}`);
					interaction.reply({ content: `Successfully joined <@&${rr.emoji}>!`, ephemeral: true });
					console.log(`${interaction.user.tag} joined ${interaction.customId}!`);
					role = 'JOINED ROLE VIA REACTION ROLES';
				}
				const embed = new EmbedBuilder();
				embed.setColor("#0000ff");
				embed.setTitle(`**Moderation** - ${role}`);
				embed.setTimestamp();
				embed.addFields(
					{ name: 'Member:', value: `<@${interaction.member.user.id}>`, inline: true },
					{ name: 'Role:', value: `<@&${rr.role}>`, inline: true },
				);
				//console.log(interaction.member.user.username);
				if (client.logchannel.get().logchannel) {
					const logchannel = interaction.guild.channels.cache.get(client.logchannel.get().logchannel);
					logchannel.send({ embeds: [embed] });
				}
			} else {
				console.log(`Reaction Role does not exist in database, skipping!`);
			}
		} else {
			interaction.reply({ content: `I don't have permissions anymore to manage roles, contact a staff member!`, ephemeral: true });
		}
	}

	if (!slashCommand) return client.slashCommands.delete(interaction.commandName);
	try {
		if (slashCommand.cooldown) {
			
			if (cooldown.has(`slash-${slashCommand.name}${interaction.user.id}`)) {
				console.log(`Someone used an interaction on: ${interaction.guild.name} but it was on cooldown. ${interaction.commandName}.`);
				return interaction.reply({ content: config.messages["COOLDOWN_MESSAGE"].replace('<duration>', ms(cooldown.get(`slash-${slashCommand.name}${interaction.user.id}`) - Date.now(), { long: true })), ephemeral: true })
			}
			if (slashCommand.userPerms || slashCommand.botPerms) {
				if (!interaction.memberPermissions.has(PermissionsBitField.resolve(slashCommand.userPerms || []))) {
					console.log(`Someone failed to use an interaction on: ${interaction.guild.name} : ${interaction.commandName}. As they didn't have permissions`);
					const userPerms = new EmbedBuilder()
						.setDescription(`🚫 ${interaction.user}, You don't have \`${slashCommand.userPerms}\` permissions to use this command!`)
						.setColor('Red')
					return interaction.reply({ embeds: [userPerms] })
				}
				if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(slashCommand.botPerms || []))) {
					console.log(`Someone failed to use an interaction on: ${interaction.guild.name} : ${interaction.commandName}. As the bot didn't have permissions`);
					const botPerms = new EmbedBuilder()
						.setDescription(`🚫 ${interaction.user}, I don't have \`${slashCommand.botPerms}\` permissions to use this command!`)
						.setColor('Red')
					return interaction.reply({ embeds: [botPerms] })
				}

			}

			await slashCommand.run(client, interaction);
			console.log(`Someone used an interaction on: ${interaction.guild.name} : ${interaction.commandName}.`);
			cooldown.set(`slash-${slashCommand.name}${interaction.user.id}`, Date.now() + slashCommand.cooldown)
			setTimeout(() => {
				cooldown.delete(`slash-${slashCommand.name}${interaction.user.id}`)
			}, slashCommand.cooldown)
		} else {
			if (slashCommand.userPerms || slashCommand.botPerms) {

				if (!interaction.memberPermissions.has(PermissionsBitField.resolve(slashCommand.userPerms || []))) {
					console.log(`Someone failed to use an interaction on: ${interaction.guild.name} : ${interaction.commandName}. As they didn't have permissions`);
					const userPerms = new EmbedBuilder()
						.setDescription(`🚫 ${interaction.user}, You don't have \`${slashCommand.userPerms}\` permissions to use this command!`)
						.setColor('Red')
					return interaction.reply({ embeds: [userPerms] })
				}
				if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(slashCommand.botPerms || []))) {
					console.log(`Someone failed to use an interaction on: ${interaction.guild.name} : ${interaction.commandName}. As the bot didn't have permissions`);
					const botPerms = new EmbedBuilder()
						.setDescription(`🚫 ${interaction.user}, I don't have \`${slashCommand.botPerms}\` permissions to use this command! You should get someone todo /botcheck.`)
						.setColor('Red')
					return interaction.reply({ embeds: [botPerms] })
				}

			}
			await slashCommand.run(client, interaction);
			console.log(`Someone used an interaction on: ${interaction.guild.name} : ${interaction.commandName}.`);
		}
	} catch (err) {
		console.log(err);
		client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
		return;
	}
};