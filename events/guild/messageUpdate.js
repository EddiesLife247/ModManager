const {
	MessageEmbed,
	Message
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require(`../../handlers/functions`);
const { logMessage } = require(`../../handlers/newfunctions`);
const Discord = require(`discord.js`);
module.exports = async (client, newMessage, message) => {
	try {
	//console.log(message);
	client.features.ensure(message.guild.id, {
        music: true,
        logs: true,
        reactionroles: true,
        moderation: true,
        fun: true,
        youtube: false,
        support: true,
        points: true,
    });
    if (client.features.get(message.guild.id, "logs") == false) {
        return;
    }
	if(message.content.includes('Deleted')) {
		message.delete();
		logMessage('Original Message Deleted, so deleting this one.')
	}
	if (message.bot) { return }
	client.settings.ensure(message.guild.id, {
		prefix: config.prefix,
		defaultvolume: 50,
		defaultautoplay: false,
		defaultfilters: [`bassboost6`, `clear`],
		djroles: [],
		botchannel: [],
		logxhannel: [],
	})

	//console.log(`pin updated in ${channel.guild.id}`);
	//console.log(settings.modLogChannel);
	if (message.guild.channels.cache.find(c => c.id == client.settings.get(message.guild.id, "logchannel"))) {
		if(message.author.bot) { return; }
		
		/*
			Create an EMBED for the message to send to the log channel as defined in Bot Settings for the guild.
		*/
		//console.log(`Message Edit Log Enabled`);
		if (message.lastPinTimestamp == '0' || message.lastPinTimestamp == null) {
			var pinned = false
		} else {
			var pinned = true
		}
		if(message.content.length > 1000) {
			var newContent = "Message too long to log";
		} else {
			var newContent = message.content;
		}
		if(newMessage.content.length > 1000) {
			var oldContent = "Message too long to log";
		} else {
			var oldContent = newMessage.content;
		}
		const embed = new Discord.MessageEmbed()
			.setColor("#ff0000")
			.setFooter({text: `${newMessage.guild.name}`})
			.setTitle("**Moderation** - Message Edited")
			.addField('Author', `<@${message.author.id}>`, true)
			.addField('Channel', newMessage.channel.name, true)
			.addField('Pinned Recently?:', `> ${pinned}`, true)
			.addField('New Message:', `> ${newContent}`)
			.addField('Old Message:', `> ${oldContent}`)
			.setColor('0x00AAFF')
			.setTimestamp();
		// Send the message to the Mod Log Channel


		message.guild.channels.cache.find(c => c.id == client.settings.get(message.guild.id, "logchannel")).send({ embeds: [embed] });
		logMessage(client, "success", message.guild, "message update");
		/*
		client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${message.guild.name} triggered event: messageUpdate Successfully`);
		//client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${message.guild.name} triggered event: MessageUpdate Successfully`);
		*/
	}
	//Logging Disabled do nothing.
} catch (e) {
    const { logMessage } = require(`../../handlers/newfunctions`);
    logMessage(client, `error`, message.guild, `Error with MESSAGE UPDATE event: ${e.message} | \`\`\` ${e.stack} \`\`\``);
}

};