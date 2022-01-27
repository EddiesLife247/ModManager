const {
    MessageEmbed, CategoryChannel
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const SQLite = require("better-sqlite3");
const supsql = new SQLite(`./databases/support.sqlite`);
module.exports = {
    name: "open", //the command name for execution & for helpcmd [OPTIONAL]
    cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
    description: "Opens a Support Ticket!", //the command description for helpcmd [OPTIONAL]
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!	
        //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
        //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
        //{"Integer": { name: "volume", description: "Volume Amount between 1 & 150!", required: true }}, //to use in the code: interacton.getString("ping_amount")
        //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
        //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
        //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
        //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
        {
            "String": {
                name: "subject_of_ticket",
                description: "A Brief Overview do not share personal information here",
                required: true
            }
        }, //to use in the code: interacton.getRole("what_role")
    ],
    run: async (client, interaction) => {
        client.features.ensure(interaction.guild.id, {
			music: true,
			logs: true,
			reactionroles: true,
			moderation: true,
			fun: true,
			youtube: false,
			support: true,
			points: true,
		});
		if (client.features.get(interaction.guild.id, "support") == false) {
			return interaction.reply({
				embeds: [new MessageEmbed()
					.setColor(ee.wrongcolor)
					.setFooter(ee.footertext, ee.footericon)
					.setTitle(`Feature disabled on this server!`)
				],
				ephemeral: true
			});
		}
        let ticketId = Math.floor(Math.random() * 100) + 1;
        let subject = options.getChannel("subject_of_ticket");
        let supportTeamId = client.settings.get(interaction.guild.id, `supportTeam`);
        let channelName = `${interaction.user.name}-${ticketId}` //Arguments to set the channel name
        client.getSupport = supsql.prepare("SELECT * FROM tickets WHERE id = ?  AND guild = ?");
        client.addSupport = supsql.prepare("INSERT OR REPLACE INTO tickets (id, user, guild, topic, subject, status) VALUES (@id, @user, @guild, @topic, @subject, @status);");
        client.removeRr = supsql.prepare("DELETE FROM tickets WHERE id = ? AND guild = ?");
        let TicketName = `${interaction.user.id}-${ticketId}`;
        let userId = interaction.user.id;
        let guildId = interaction.guild.id;
        let status = "Open";
        let cat = "Support Tickets";
        let rr;
        rr = client.getSupport.get(TicketName, interaction.guild.id);
        if (!rr) {
            score = { id: `${TicketName}`, user: userId, guild: guildId, topic: ticketId, subject: subject, status: status }
            client.addSupport.run(score);
            interaction.guild.channels.create(channelName, {
                reason: 'Support Channel Created',
                parent: cat,
                type: "text", //This create a text channel, you can make a voice one too, by changing "text" to "voice"
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone, //To make it be seen by a certain role, user an ID instead
                        //allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'], //Allow permissions
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'] //Deny permissions
                    },
                    {
                        id: interaction.user.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                    },
                    {
                        id: interaction.guild.roles.cache.get(supportTeamId),
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                    },
                ],
            });
            interaction.reply(`Channel Created for your ticket: <#${channelName}`);
        } else {
            return interaction.reply("A Support ticket already exists in the database!");
        }


    }
}