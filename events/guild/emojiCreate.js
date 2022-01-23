const {
	MessageEmbed,
	Message
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require(`../../handlers/functions`);
const Discord = require(`discord.js`);
module.exports = async (client, emoji) => {
	const guild = emoji.guild;
	if (guild.me.permissions.has("VIEW_AUDIT_LOG")) {
		client.settings.ensure(emoji.guild.id, {
			prefix: config.prefix,
			defaultvolume: 50,
			defaultautoplay: false,
			defaultfilters: [`bassboost6`, `clear`],
			djroles: [],
			botchannel: [],
			logxhannel: [],
		})
		// Load the guild's settings
		if (emoji.guild.channels.cache.find(c => c.id == client.settings.get(emoji.guild.id, "logchannel"))) {
			const embed = new Discord.MessageEmbed()
				.setAuthor(`Modlogs`, emoji.guild.iconURL())
				.setColor("#ff0000")
				.setFooter(emoji.guild.name, emoji.guild.iconURL())
				.setTitle("**Moderation** - Emoji Created")
				.addField('Name', `> - :${emoji.name}:`, true)
				.addField('Created by', `> - ${emoji.author}`, true)
				.addField('Identifier', `> - :${emoji.identifier}:`)
				.setColor('00ff00')
				.setTimestamp();

			emoji.guild.channels.cache.find(c => c.id == client.settings.get(emoji.guild.id, "logchannel")).send({ embeds: [embed] });
			client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${emoji.guild.name} triggered event: EmojiCreated Successfully`);
			//client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${message.guild.name} triggered event: MessageDelete Successfully`);
			//console.log(`Found log channel and sent message: ${settings.modLogChannel} in ${message.guild.id}`);
		} else {
			//console.log(`Cannot find channel: ${settings.modLogChannel} in: ${message.guild.name}`);
		}
	}


};