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
	const prefix = client.prefix;
	const guild = message.guild;
	if (!message.guild || !message.channel || message.author.bot) return;
	if (message.channel.partial) await message.channel.fetch();
    if (message.partial) await message.fetch();
	// Let people know what the prefix is if they mention my name.
	const prefixMention = new RegExp(`^<@!?${client.user.id}> ?$`);
    if (message.content.match(prefixMention)) {
      return message.reply(`My prefix on this guild is \`!\``);
    }
	//check if Message Filter is enabled
	

		
		if (message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
			client.floodprotection = botsql.prepare(`SELECT settingValue FROM settings WHERE setting = 'floodprotection' AND guildid = ${guild.id}`);
			let floodprotection = client.floodprotection.all().settingValue;
			if(floodprotection) {
			if (msgCooldown(message, cooldown)) {
				//WARNING GOES HERE
				let banneduserId = message.author.id;
				let bannedguildId = message.guild.id;
				let bannedtype = 'WARNING';
				let bannedlength = 2;
				let bannedreason = `[AUTO] User spammed in a channel meeting guild message cooldown requirements ${cooldown} seconds`;
				let bannedbanid = Math.floor(Math.random() * 9999999999) + 25;
				client.addBan = bansql.prepare("INSERT INTO bans (id, user, guild, reason, approved, appealed, date, length) VALUES (@id, @user, @guild, @reason, @approved, 'No', datetime('now'), @length);");
				score5 = { id: `${banneduserId}-${bannedbanid} `, user: banneduserId, guild: bannedguildId, reason: bannedreason, approved: bannedtype, length: bannedlength };
				const KickCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'WARNING' AND user = ${message.author.id} AND guild = ${message.guild.id} `).all();
				member = await message.guild.members.cache.get(message.author.id);
				if (KickCount.length == 0) {
				  client.addBan.run(score5);
				  message.delete();
				  message.channel.send({
					embeds: [new Discord.MessageEmbed()
					  .setColor(ee.wrongcolor)
					  .setFooter(ee.footertext, ee.footericon)
					  .setTitle(replacemsg(settings.messages.msgcooldown, {
						timeLeft: msgCooldown(message, cooldown)
					  }))
					  .addField(`WARNINGS: `, `${KickCount.length + 1} /  ${client.settings.get(message.guild.id, "warnkick")}`)
					]
				  }).then(msg => {
					setTimeout(function () { // Setup a timer
					  msg.delete(); // Deletes the ticket message
					}, 8000); // 5 seconds in milliseconds
				  });
				  return;
				}
				else if (client.settings.get(message.guild.id, "warnkick") == 0 || client.settings.get(message.guild.id, "warnkick") == null) {
				  client.addBan.run(score5);
				  message.delete();
				  message.channel.send({
					embeds: [new Discord.MessageEmbed()
					  .setColor(ee.wrongcolor)
					  .setFooter(ee.footertext, ee.footericon)
					  .setTitle(replacemsg(settings.messages.msgcooldown, {
						timeLeft: msgCooldown(message, cooldown)
					  }))
					  .addField(`WARNINGS: `, `${KickCount.length + 1} /  ${client.settings.get(message.guild.id, "warnkick")}`)
					]
				  }).then(msg => {
					setTimeout(function () { // Setup a timer
					  msg.delete(); // Deletes the ticket message
					}, 8000); // 5 seconds in milliseconds
				  });
				  return;
				}
				else if (KickCount.length >= client.settings.get(message.guild.id, "warnkick")) {
				  member.timeout(60 * 60 * 1000, `You were Warned ${KickCount.length} times within the last 15 days, you now have a 1 hour timeout`)
				  message.delete();
				  return;
	  
				} else {
				  await client.addBan.run(score5);
				  message.delete();
				  message.channel.send({
					embeds: [new Discord.MessageEmbed()
					  .setColor(ee.wrongcolor)
					  .setFooter(ee.footertext, ee.footericon)
					  .setTitle(replacemsg(settings.messages.msgcooldown, {
						timeLeft: msgCooldown(message, cooldown)
					  }))
					  .addField(`WARNINGS: `, `${KickCount.length + 1} /  ${client.settings.get(message.guild.id, "warnkick")}`)
					]
				  }).then(msg => {
					setTimeout(function () { // Setup a timer
					  msg.delete(); // Deletes the ticket message
					}, 8000); // 5 seconds in milliseconds
				  });
				  return;
				}
	  
	  
			  }
			}

			const forbidenWords = ['fuck', 'shit', 'bollocks', 'twat', 'nigger', 'bastard', 'cunt', '.xxx', 'XXXX'];
			client.messagefilter = botsql.prepare(`SELECT settingValue FROM settings WHERE setting = 'messagefilter' AND guildid = ${guild.id}`);
			let msgfilter = client.messagefilter.get().settingValue;
			client.warnkick = botsql.prepare(`SELECT settingValue FROM settings WHERE setting = 'warnkick' AND guildid = ${guild.id}`);
			let warnkick = client.warnkick.get().settingValue;
			
			if(msgfilter == 'true'){
			//console.log(msgfilter);
				// Message Filter enabled on the guild.
				//console.log(message.content);
				if (message.channel.nsfw == false) {
					try {
					  var customFilter = new Filter({ placeHolder: 'XX' });
					  if (message.content == null) {
						  console.log("NO CONTENT MSG");
						// NO NEED TO CHECK ITS NOTHING!
					  } else {
						  //console.log(message.content);
						const msg = customFilter.clean(message.content);
						console.log(msg);
						for (var i = 0; i < forbidenWords.length; i++) {
						  if (msg.includes(forbidenWords[i])) {
							  console.log("FILTER MSG");
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
		  
							} catch (err) {
								console.log(err);
							  message.channel.send(`Please do not swear on this server! <@${message.author.id}> WARNING: ${KickCount.length + 1} /  ${warnkick}`);
							  logMessage(client, "error", message.guild, `Error at line 190: ${err} (messageCreate)`);
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

		} else {
			console.log("Filter enabled, but not enough permissions set. Server must check permissions with /botcheck");
		}

	
	  // Check if the message is now a command.
	if(!message.content.startsWith(prefix)) return; 
	const args = message.content.slice(prefix.length).trim().split(/ +/g); 
	const cmd = args.shift().toLowerCase();
	if(cmd.length == 0 ) return;
	let command = client.commands.get(cmd)
	if(!command) command = client.commands.get(client.aliases.get(cmd));

	if(command) {
		if(command.cooldown) {
				if(cooldown.has(`${command.name}${message.author.id}`)) return message.channel.send({ content: config.messages["COOLDOWN_MESSAGE"].replace('<duration>', ms(cooldown.get(`${command.name}${message.author.id}`) - Date.now(), {long : true}) ) });
				if(command.userPerms || command.botPerms) {
					if(!message.member.permissions.has(PermissionsBitField.resolve(command.userPerms || []))) {
						const userPerms = new EmbedBuilder()
						.setDescription(`🚫 ${message.author}, You don't have \`${command.userPerms}\` permissions to use this command!`)
						.setColor('Red')
						return message.reply({ embeds: [userPerms] })
					}
					if(!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(command.botPerms || []))) {
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
				if(command.userPerms || command.botPerms) {
					if(!message.member.permissions.has(PermissionsBitField.resolve(command.userPerms || []))) {
						const userPerms = new EmbedBuilder()
						.setDescription(`🚫 ${message.author}, You don't have \`${command.userPerms}\` permissions to use this command!`)
						.setColor('Red')
						return message.reply({ embeds: [userPerms] })
					}
				
					if(!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(command.botPerms || []))) {
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