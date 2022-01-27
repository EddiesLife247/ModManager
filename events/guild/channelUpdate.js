const {
	MessageEmbed,
	Message
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require(`../../handlers/functions`);
const Discord = require(`discord.js`);
const { logMessage } = require(`../../handlers/newfunctions`);
module.exports = async (client, newChannel, channel) => {
	const guild = channel.guild;
	if (guild.me.permissions.has("VIEW_AUDIT_LOG")) {
		client.settings.ensure(channel.guild.id, {
			prefix: config.prefix,
			defaultvolume: 50,
			defaultautoplay: false,
			defaultfilters: [`bassboost6`, `clear`],
			djroles: [],
			botchannel: [],
			logchannel: [],
			topicmodlogs: false,
		})
		//console.log(channel);
		// Load the guild's settings
		if (client.settings.get(channel.guild.id, "logchannel")) {
			if (newChannel.topic != channel.topic) {
				var topiclog = client.settings.get(channel.guild.id, "topicmodlogs");
				if (topiclog == false) {
					var topicembed = false;
					return;
					// DO NOTHING ITS DISABLED
				}
				else {
					var topicembed = true;
				}
			}
			if (topicembed == true) {
				//console.log(channel.guild.channels.cache.find(c => c.name == settings.modLogChannel));
				const embed = new Discord.MessageEmbed()
					.setAuthor(`Modlogs`, channel.guild.iconURL())
					.setColor("#0000ff")
					.setFooter(channel.guild.name, channel.guild.iconURL())
					.setTitle("**Moderation** - Updated Channel Info")
					.addField("**Name Was**", `${newChannel.name}`, true)
					.addField("**Name Now**", `${channel.name}`, true)
					.addField("**NSFW Was**", `${newChannel.nsfw}`, true)
					.addField("**NSFW Now**", `${channel.nsfw}`, true)
					.addField("**Category ID Was**", `${newChannel.parentId}`, true)
					.addField("**Category ID Now**", `${channel.parentId}`, true)
					.addField("**Slow Mode Was**", `${newChannel.rateLimitPerUser}`, true)
					.addField("**Slow Mode Now**", `${channel.rateLimitPerUser}`, true)
					.addField(`\u200B`, '\u200B')
					.addField("**Topic Was**", `${newChannel.topic}`, true)
					.addField("**Topic Now**", `${channel.topic}`, true)

					.setTimestamp();
				channel.guild.channels.cache.find(c => c.id == client.settings.get(channel.guild.id, "logchannel")).send({ embeds: [embed] });
				logMessage(client, "success", channel.guild, "Channel Update Log Message");
			}
			//client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${message.guild.name} triggered event: ChannelUpdate Successfully`);
			//console.log(`channel updated in a guild that has logs enabled!`);
		}
		else {
            logMessage(client, "Logs Disabled", channel.guild, "Channel Update Log Message");

			//console.log(`channel updated in a guild that has logs disabled!`);
			return;
		}
	}

};