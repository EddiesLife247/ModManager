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
	
	client.messagefilter = botsql.prepare(`SELECT * FROM settings WHERE setting = 'messagefilter' AND guildid = ?`);
	let msgfilter;
	msgfilter = client.messagefilter.get(guild.id);
	console.log(msgfilter);
	

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