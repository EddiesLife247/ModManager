const {
	MessageEmbed,
	Message
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require(`../../handlers/functions`);
const Discord = require(`discord.js`);
module.exports = async (client, message) => {
	client.settings.ensure(message.guild.id, {
		prefix: config.prefix,
		defaultvolume: 50,
		defaultautoplay: false,
		defaultfilters: [`bassboost6`, `clear`],
		djroles: [],
		botchannel: [],
		logxhannel: [],
	})
	// Load the guild's settings

	console.log(emoji);
	const settings = getSettings(guild.id);

};