const SQLite = require("better-sqlite3");
const ytsql = new SQLite(`./databases/yt.sqlite`);
module.exports = {
    name: "ytsubscribe", //the command name for execution & for helpcmd [OPTIONAL]

    category: "YouTube",
    aliases: ["ytsub"],
    usage: "ytsub <channelid> <role> <channel>",

    cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
    description: "Add Reaction Role", //the command description for helpcmd [OPTIONAL]
    memberpermissions: ["MANAGE_ROLES"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    run: async (client, message, args) => {
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
		if(client.features.get(message.guild.id, "youtube") == false) {
			return;
		  } else {
        console.log(message.content);
        return message.reply("This command is still being developed!")
        try {
            if (!message.mentions.channels.first()) return message.reply("Error: You did not mention a channel.");
            if (!message.mentions.roles.first()) return message.reply("Error: You did not mention a role!");
            const rrchan = message.mentions.channels.first().id;
            const rrrole = message.mentions.roles.first().id;
            const ytchannel = args[0];
            if (!ytchannel) {
                return message.reply("You have formatted this command incorrectly. (MESSAGE ID MISSING) (See help rradd for more information).");
            }
            if (ytchannel != rrchan) {
                if (!ytchannel != rrrole) {

                    client.getRr = ytsql.prepare("SELECT * FROM ytsubs WHERE ytchan = ?  AND guild = ? AND channel = ?");
                    client.addRr = ytsql.prepare("INSERT OR REPLACE INTO ytsubs (id, ytchan, guild, role, channel) VALUES (@id, @ytchan, @guild, @role, @rrchan);");
                    client.removeRr = ytsql.prepare("DELETE FROM ytsubs WHERE ytchan = ? AND guild = ? AND channel = ?");
                    let rr;
                    rr = client.getRr.get(ytchannel, message.guild.id, rrchan);
                    if (!rr) {
                        score = { id: `${message.guild.id}-${ytchannel}`, ytchan: ytchannel, guild: message.guild.id, role: rrrole, rrchan: rrchan }
                        client.addRr.run(score);
                        try {
                            let channel = message.mentions.channels.first();
                            //console.log(channel);
                            const YouTubeNotifier = require('youtube-notification');
                            const notifier = new YouTubeNotifier({
                                hubCallback: 'https://modmanager.manumission247.co.uk:38455/yt',
                                secret: 'NhqR9CUCU5fqb%h44e'
                            });

                            notifier.subscribe(ytchannel);
                            message.reply(`Subscribed to: ${ytchannel}, We will ping <@&${rrrole}> on <#${rrchan}> when they upload a video!`);
                        }
                        catch (err2) {
                            message.reply("There was an error! while reacting to the message!");
                            console.log(err2);
                        }

                        return;
                    } else {
                        return message.reply("This Reaction Role has already been added!");
                    }
                    // And we save it!


                } else {
                    return message.reply("You have formatted this command incorrectly. (CANNOT SET ROLE AS EMOJI) (See help rradd for more information).");
                }
            } else {
                return message.reply("You have formatted this command incorrectly. (CANNOT SET CHANNEL AS EMOJI) (See help rradd for more information).");
            }

        } catch (e) {
            const { logMessage } = require(`../../handlers/newfunctions`);
            logMessage(client, `error`, message.guild, `Error with YTSUBSCRIBE command: ${e.message} | \`\`\` ${e.stack} \`\`\``);
        }

    }
}
};