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
module.exports = async (client, message) => {
	try {
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
	const guild = message.guild;
	if (guild.me.permissions.has("VIEW_AUDIT_LOG")) {
		client.settings.ensure(message.guild.id, {
			prefix: config.prefix,
			defaultvolume: 50,
			defaultautoplay: false,
			defaultfilters: [`bassboost6`, `clear`],
			djroles: [],
			botchannel: [],
			logchannel: [],
		})
		if (message.guild.channels.cache.find(c => c.id == client.settings.get(message.guild.id, "logchannel"))) {
			try { 		//console.log("message deleted, checking it");
				//if (message.me.permissions.has("VIEW_AUDIT_LOG")) {
				const fetchedLogs = await message.guild.fetchAuditLogs({
					limit: 1,
					type: 'MESSAGE_DELETE',
				});
				const deletionLog = fetchedLogs.entries.first();
				if (!deletionLog) return console.log(`A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`);
				const { executor, target } = deletionLog;
				if (target.id === message.author.id) {
					var execute = executor.tag;
				}
				else {
					var execute = executor.tag == "UNKNOWN";
				}

				//console.log(channel.guild.channels.cache.find(c => c.name == settings.modLogChannel));
				const embed = new Discord.MessageEmbed()
					.setAuthor(`Modlogs`, message.guild.iconURL())
					.setColor("#ff0000")
					.setFooter(message.guild.name, message.guild.iconURL())
					.setTitle("**Moderation** - Message Deleted")
					.addField('Author', `> - ${message.author.username}`, true)
					.addField('Channel', `> - ${message.channel.name}`, true)
					.addField('Message', `> - ${message.cleanContent}`)
					.addField('Executor', `> - ${execute}`)
					.setColor('ff0000')
					.setTimestamp();
				if (message.guild.channels.cache.find(c => c.id == client.settings.get(message.guild.id, "logchannel"))) {
					message.guild.channels.cache.find(c => c.id == client.settings.get(message.guild.id, "logchannel")).send({ embeds: [embed] });
					logMessage(client, "success", message.guild, `Message Deleted`);
					//client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${message.guild.name} triggered event: MessageDelete Successfully`);
					//console.log(`Found log channel and sent message: ${settings.modLogChannel} in ${message.guild.id}`);
				} else {
					//console.log(`Cannot find channel: ${settings.modLogChannel} in: ${message.guild.name}`);
				}
				//}
			}
			catch (err) {
				//KNOWN ISSUE
			}
		}
		else {
			//console.log(`channel updated in a guild that has logs disabled!`);
			return;
		}
	}
} catch (e) {
    const { logMessage } = require(`../../handlers/newfunctions`);
    logMessage(client, `error`, message.guild, `Error with MESSAGE DELETE event: ${e.message} | \`\`\` ${e.stack} \`\`\``);
}
};