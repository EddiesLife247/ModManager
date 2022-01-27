const {
    MessageEmbed, CategoryChannel
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const SQLite = require("better-sqlite3");
const supsql = new SQLite(`./databases/support.sqlite`);
module.exports = {
    category: "Support",
    aliases: ["newticket"],
    usage: "open <subject>",
    name: "open", //the command name for execution & for helpcmd [OPTIONAL]
    cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
    description: "Opens a Support Ticket!", //the command description for helpcmd [OPTIONAL]
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    run: async (client, message, args) => {
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
        if (client.features.get(message.guild.id, "support") == false) {
            return;
        } else {
            client.settings.ensure(message.guild.id, {
                prefix: config.prefix,
                defaultvolume: 50,
                defaultautoplay: false,
                defaultfilters: [`bassboost6`, `clear`],
                djroles: [],
                botchannel: [],
                logchannel: [],
                topicmodlogs: true,
                randomtopic: [],
                qotdchannel: [],
                levelupchan: [],
                swearfilter: false,
                urlfilter: false,
                invitefilter: false,
                supportTeamId: [],
            })
            let ticketId = Math.floor(Math.random() * 100) + 1;
            let subject = args.join(" ");
            console.log(subject);
            //return;
            const supportTeamId = client.settings.get(message.guild.id, `supportTeamId`);
            //console.log(supportTeamId);
            //return;
            let channelName = `${message.author.username}-${ticketId}` //Arguments to set the channel name
            client.getSupport = supsql.prepare("SELECT * FROM tickets WHERE id = ?  AND guild = ?");
            client.addSupport = supsql.prepare("INSERT OR REPLACE INTO tickets (id, user, guild, initmsg, subject, status) VALUES (@id, @user, @guild, @initmsg, @subject, @status);");
            client.removeRr = supsql.prepare("DELETE FROM tickets WHERE id = ? AND guild = ?");
            let TicketName = `${message.author.id}-${ticketId}`;
            const userId = message.author.id;
            let guildId = message.guild.id;
            let status = "Open";
            var TextCategory = message.guild.channels.cache.find(cat => cat.name === "Support");
            if (TextCategory) {
                var categoryID = message.guild.channels.cache.find(cat => cat.name === "Support").id;
            }
            else {
                var categoryID = "";
                var error = "No category found named: 'Support'";
            }
            if (error) {
                message.channel.send(`<@${supportTeamId}> - ERROR DETECTED: ${error}`);
            }
            //let cat = "Support";
            let ticket;
            ticket = client.getSupport.get(TicketName, message.guild.id);
            const guild = client.guilds.cache.get(guildId).roles.everyone.id;
            console.log(guild);
            await message.guild.channels.create(channelName, {
                reason: 'Support Channel Created',
                //parent: categoryID,
                type: "GUILD_TEXT", //This create a text channel, you can make a voice one too, by changing "text" to "voice"
                permissionOverwrites: [
                    {
                        id: guild, //To make it be seen by a certain role, user an ID instead
                        //allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'], //Allow permissions
                        deny: ['VIEW_CHANNEL'] //Deny permissions
                    },
                ],
            }).then(channel => {
                channel.permissionOverwrites.create(guild, { VIEW_CHANNEL: false });
                channel.permissionOverwrites.create(userId, { VIEW_CHANNEL: true });
                channel.permissionOverwrites.create(supportTeamId, { VIEW_CHANNEL: true });
                channel.setParent(categoryID)

                channel.send(`New Support Ticket by: <@${message.author.id}> \`\`\`${subject}\`\`\` \n React with: 🔒 to Lock \n React with: ❌ to Close and Delete.`).then(msg => {
                    msg.react('🔒');
                    msg.react('❌')
                    msg.pin();
                    score = { id: `${TicketName}`, user: userId, guild: guildId, initmsg: msg.id, subject: subject, status: status }
                    client.addSupport.run(score);
                })
                message.delete();

            });

        }
    } catch (e) {
        const { logMessage } = require(`../../handlers/newfunctions`);
        logMessage(client, `error`, message.guild, `Error with OPEN command: ${e.message} | ${e.stack}`);
    }
    }
}