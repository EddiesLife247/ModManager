const { EmbedBuilder, Collection, PermissionsBitField } = require('discord.js')
const ms = require('ms');
const config = require('../../configs/config.json');
const SQLite = require("better-sqlite3");
var Filter = require('bad-words'),
	filter = new Filter();
const cooldown = new Collection();
const scoresql = new SQLite(`./databases/scores.sqlite`);
const bansql = new SQLite(`./databases/bans.sqlite`);
const botsql = new SQLite(`./databases/bot.sqlite`);
module.exports = async (client, message) => {
	if (!message.guild || !message.channel || message.author.bot) return;
	if (message.channel.partial) await message.channel.fetch();
	if (message.partial) await message.fetch();
	client.logchannel = botsql.prepare(`SELECT logchannel FROM settings WHERE guildid = '${message.guild.id}'`);
	const prefix = client.prefix;
	const guild = message.guild;

	// Let people know what the prefix is if they mention my name.
	const prefixMention = new RegExp(`^<@!?${client.user.id}> ?$`);
	if (message.content.match(prefixMention)) {
		const embed = new EmbedBuilder();
        embed.setColor("#0000ff");
        embed.setTitle(`**Mod Manager** - V4.0(BETA)`);
        embed.setTimestamp();
        embed.setURL(`https://discord.gg/ynUy2Sfx9U`);
        embed.addFields(
            { name: 'Owner:', value: `EddieDoesStuff`, inline: true },
            { name: 'Support Server:', value: `https://discord.gg/ynUy2Sfx9U`, inline: true },
            { name: 'Dashboard:', value: `Dashboard Coming Soon`, inline: true },
            { name: 'Invite Me to your server:', value: `https://discord.com/api/oauth2/authorize?client_id=714939771935522838&permissions=1127763619046&scope=bot%20applications.commands`, inline: true },
			{ name: 'Slash Commands ONLY:', value: `We only support Slash Commands in version 4. More info use /help`, inline: true },
            { name: 'Support Command:', value: `/help`, inline: true },
        );
		console.log(`I was highlighted in: ${message.guild.name} : ${message.channel.name}.`);
        return message.reply({ content: `Hi, I am Mod Manager, here is some information about me!`, embeds: [embed], ephemeral: true });

	}
	client.setup = botsql.prepare(`SELECT * FROM settings WHERE guildid = '${message.guild.id}'`);
	if (!client.setup.all().length) {
		//console.log(`${message.guild.name} - Is not setup!`);
		return;
	}
	//check if Message Filter is enabled
	if (message.guild.id == '787871047139328000') {
		if (message.channel.id == '901905815810760764') {
			if (message.content === "?@updatenotice") {
				client.guilds.cache.each(guild => {
					try {
						const channel = guild.channels.cache.find(channel => channel.name === 'general') || guild.channels.cache.first();
						if (channel) {
							if (guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) {
								if (channel.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) {
									channel.send('Mod Manager is now updated to VERSION 4.0 you will need to re-configure me using /config - if you need help use /help');
								}
							}
						} else {
							console.log('The server ' + guild.name + ' has no channels.');
						}
					} catch (err) {
						console.log('Could not send message to ' + guild.name + '.');
					}
				});
			}
		}
	}

	if (message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
		const forbidenWords = ['fuck', 'shit', 'bollocks', 'twat', 'nigger', 'bastard', 'cunt', '.xxx', 'XXXX'];
		client.messagefilter = botsql.prepare(`SELECT messagefilter FROM settings WHERE guildid = '${message.guild.id}'`);
		if (client.messagefilter.get().messagefilter) {
			msgfilter = client.messagefilter.get().messagefilter;
			if (msgfilter == "1") {
				if (message.channel.nsfw == false) {
					try {
						var customFilter = new Filter({ placeHolder: 'XX' });
						if (message.content == null) {
							// NO NEED TO CHECK ITS NOTHING!
						} else {
							//console.log(message.content);
							const msg = customFilter.clean(message.content);
							for (var i = 0; i < forbidenWords.length; i++) {
								if (msg.includes(forbidenWords[i])) {
									const embed = new EmbedBuilder();
									embed.setColor("#0000ff");
									embed.setTitle(`**Moderation** - Blocked Messagge`);
									embed.setTimestamp();
									embed.addFields(
										{ name: 'Member:', value: `<@${message.author.id}>`, inline: true },
										{ name: 'Content:', value: `${message.content}`, inline: true },
										{ name: 'Reason:', value: `Swearword Filter Enabled, not a NSFW channel`, inline: true },
									);
									console.log(`Message Filtered in: ${message.guild.name} : ${message.channel.name}.`);
									if (!client.logchannel.get().settingValue == "") {
										const logchannel = message.guild.channels.cache.get(client.logchannel.get().settingValue);
										logchannel.send({ embeds: [embed] });
									}
									try {
										let banneduserId = message.author.id;
										let bannedguildId = message.guild.id;
										let bannedtype = 'WARNING';
										let bannedlength = 15;
										let bannedreason = '[AUTO] User warned for swearing';
										let bannedbanid = Math.floor(Math.random() * 9999999999) + 25;
										client.addBan = bansql.prepare("INSERT INTO bans (id, user, guild, reason, approved, appealed, date, length) VALUES (@id, @user, @guild, @reason, @approved, 'No', datetime('now'), @length);");
										score2 = { id: `${banneduserId}-${bannedbanid}`, user: banneduserId, guild: bannedguildId, reason: bannedreason, approved: bannedtype, length: bannedlength };
										const KickCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'WARNING' AND user = ${message.author.id} AND guild = ${message.guild.id}`).all();
										//console.log(KickCount.length);
										member = await message.guild.members.cache.get(message.author.id);
										//console.log(member);
										client.warnkick = botsql.prepare(`SELECT warnkick FROM settings WHERE guildid = '${message.guild.id}'`);
										if (client.warnkick.all().length) {
											if (KickCount.length == 0) {
												client.addBan.run(score2);
												message.channel.send(`Please do not swear on this server! <@${message.author.id}> WARNING: ${KickCount.length + 1} /  ${warnkick}`);
												message.delete();
												//console.log("Kick is set to null add data.")
												return;
											}



											else if (warnkick == 0 || warnkick == null) {
												client.addBan.run(score2);
												message.channel.send(`Please do not swear on this server! <@${message.author.id}> WARNING: ${KickCount.length + 1} /  ${warnkick}`);
												message.delete();
												//console.log("Kick is set to null add data.")
												return;
											}
											else if (KickCount.length >= warnkick) {
												member.timeout(timedout * 60 * 1000, `You were Warned ${KickCount.length} times within the last 15 days, you now have a 1 hour timeout`)
												message.channel.send(`Please do not swear on this server! <@${message.author.id}> WARNING: ${KickCount.length + 1} /  ${warnkick}`);
												message.delete();
												// console.log("meets kick req");
												return;

											} else {
												//console.log("Adding Data");
												await client.addBan.run(score2);
												message.channel.send(`Please do not swear on this server! <@${message.author.id}> WARNING: ${KickCount.length + 1} /  ${warnkick}`);
												message.delete();
												return;
											}
										}

									} catch (err) {
										console.log(err);
										message.channel.send(`Please do not swear on this server! <@${message.author.id}> WARNING: ${KickCount.length + 1} /  ${warnkick}`);
										message.delete();
										return;
									}
								}
							}
							// CODE FOR CONTENT FILTER

						}
					} catch (err) {
						//do nothing
					}
				}
			}
		}
		client.invitefilter = botsql.prepare(`SELECT invitefilter FROM settings WHERE guildid = '${message.guild.id}'`);
		if (client.invitefilter.get().invitefilter) {
			invitefilter = client.invitefilter.get().invitefilter;
			if (invitefilter == '1') {
				//console.log("invite filter enabled");
				const bannedWords = [`discord.gg`, `.gg/`, `.gg /`, `. gg /`, `. gg/`, `discord .gg /`, `discord.gg /`, `discord .gg/`, `discord .gg`, `discord . gg`, `discord. gg`, `discord gg`, `discordgg`, `discord gg /`]
				try {

					if (bannedWords.some(word => message.content.toLowerCase().includes(word))) {
						console.log('blocked');
						const embed = new EmbedBuilder();
						embed.setColor("#0000ff");
						embed.setTitle(`**Moderation** - Blocked Messagge`);
						embed.setTimestamp();
						embed.addFields(
							{ name: 'Member:', value: `<@${message.author.id}>`, inline: true },
							{ name: 'Content:', value: `${message.content}`, inline: true },
							{ name: 'Reason:', value: `Invite Filter Enabled, not got ManageMembers Permission`, inline: true },
						);
						console.log(`Invite Filtered in: ${message.guild.name} : ${message.channel.name}.`);
						if (!client.logchannel.all().length == null) {
							const logchannel = message.guild.channels.cache.get(client.logchannel.get().logchannel);
							logchannel.send({ embeds: [embed] });
						}
						console.log("invite sent");
						if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) || !message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
							try {
								console.log("deleting invite");
								await message.channel.send(`You cannot send invites to other Discord servers`);
								let banneduserId = message.author.id;
								let bannedguildId = message.guild.id;
								let bannedtype = 'WARNING';
								let bannedlength = 15;
								let bannedreason = '[AUTO] User warned for sharing discord invite links';
								let bannedbanid = Math.floor(Math.random() * 9999999999) + 25;
								client.addBan = bansql.prepare("INSERT INTO bans (id, user, guild, reason, approved, appealed, date, length) VALUES (@id, @user, @guild, @reason, @approved, 'No', datetime('now'), @length);");
								score3 = { id: `${banneduserId}-${bannedbanid}`, user: banneduserId, guild: bannedguildId, reason: bannedreason, approved: bannedtype, length: bannedlength };
								const KickCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'WARNING' AND user = ${message.author.id} AND guild = ${message.guild.id}`).all();
								member = await message.guild.members.cache.get(message.author.id);
								if (KickCount.length == 0) {
									client.addBan.run(score3);
									message.channel.send(`Please do not send invites on this server! <@${message.author.id}>`);
									message.delete();
									// console.log("Kick is set to null add data.")
									return;
								}
								else if (warnkick == 0 || warnkick == null) {
									client.addBan.run(score3);
									message.channel.send(`Please do not send invites on this server! <@${message.author.id}> WARNING: ${KickCount.length + 1} /  ${warnkick}`);
									message.delete();
									// console.log("Kick is set to null add data.")
									return;
								}
								else if (KickCount.length >= warnkick) {
									member.timeout(timedout * 60 * 1000, `You were Warned ${KickCount.length} times within the last 15 days, you now have a 1 hour timeout`)
									message.channel.send(`Please do not send invites on this server! <@${message.author.id}> WARNING: ${KickCount.length + 1} /  ${warnkick}`);
									message.delete();
									return;

								} else {
									await client.addBan.run(score3);
									message.channel.send(`Please do not send invites on this server! <@${message.author.id}> WARNING: ${KickCount.length + 1} /  ${warnkick}`);
									message.delete();
									return;
								}


							} catch (err) {
								message.channel.send(`Please do not send invites on this server! <@${message.author.id}> WARNING: ${KickCount.length + 1} /  ${warnkick}`);
								console.log(err);
								message.delete();
							}
						} else {
							console.log('invite sent, but admin permissions given.. excempting');
						}

						//if (message.author.id === message.guild.ownerID) return console.log("owner override");


						//await message.delete();


						return;
					}

				} catch (err) {
                    console.log(err);
                    client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
                    return;
                }
			}
		}
	} else {
		console.log("Not enough permissions to check message content! but not enough permissions set. Server must check permissions with /botcheck");
	}


	// Check if the message is now a command.
	if (!message.content.startsWith(prefix)) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = args.shift().toLowerCase();
	if (cmd.length == 0) return;
	let command = client.commands.get(cmd)
	if (!command) command = client.commands.get(client.aliases.get(cmd));

	if (command) {
		if (command.cooldown) {
			if (cooldown.has(`${command.name}${message.author.id}`)) return message.channel.send({ content: config.messages["COOLDOWN_MESSAGE"].replace('<duration>', ms(cooldown.get(`${command.name}${message.author.id}`) - Date.now(), { long: true })) });
			if (command.userPerms || command.botPerms) {
				if (!message.member.permissions.has(PermissionsBitField.resolve(command.userPerms || []))) {
					const userPerms = new EmbedBuilder()
						.setDescription(`🚫 ${message.author}, You don't have \`${command.userPerms}\` permissions to use this command!`)
						.setColor('Red')
					return message.reply({ embeds: [userPerms] })
				}
				if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(command.botPerms || []))) {
					const botPerms = new EmbedBuilder()
						.setDescription(`🚫 ${message.author}, I don't have \`${command.botPerms}\` permissions to use this command!`)
						.setColor('Red')
					return message.reply({ embeds: [botPerms] })
				}
			}

			command.run(client, message, args)
			cooldown.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown)
			setTimeout(() => {
				cooldown.delete(`${command.name}${message.author.id}`)
			}, command.cooldown);
		} else {
			if (command.userPerms || command.botPerms) {
				if (!message.member.permissions.has(PermissionsBitField.resolve(command.userPerms || []))) {
					const userPerms = new EmbedBuilder()
						.setDescription(`🚫 ${message.author}, You don't have \`${command.userPerms}\` permissions to use this command!`)
						.setColor('Red')
					return message.reply({ embeds: [userPerms] })
				}

				if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(command.botPerms || []))) {
					const botPerms = new EmbedBuilder()
						.setDescription(`🚫 ${message.author}, I don't have \`${command.botPerms}\` permissions to use this command!`)
						.setColor('Red')
					return message.reply({ embeds: [botPerms] })
				}
			}
			command.run(client, message, args)
		}
	}

};