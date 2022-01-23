const {
    MessageEmbed,
    Message
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const {
    check_if_dj
} = require("../../handlers/functions")
module.exports = {
    name: "add", //the command name for the Slash Command
    description: "Add's a reaction Role", //the command description for Slash Command Overview
    cooldown: 10,
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
        //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
        {
            "String": {
                name: "emoji",
                description: "What emoji are we looking for?",
                required: true
            }
        }, //to use in the code: interacton.getInteger("ping_amount")
        {
            "String": {
                name: "messageid",
                description: "What message should users react to?",
                required: true
            }
        }, //to use in the code: interacton.getInteger("ping_amount")
        {
            "Channel": {
                name: "channelid",
                description: "What channel is the message in?",
                required: true
            }
        }, //to use in the code: interacton.getInteger("ping_amount")
        {
            "Role": {
                name: "roleid",
                description: "What role are we adding/removing?",
                required: true
            }
        },  //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
        //to use in the code: interacton.getInteger("ping_amount")
        //{"String": { name: "song", description: "Which Song do you want to play", required: true }}, //to use in the code: interacton.getString("title")
        //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
        //{"Channel": { name: "in_where", description: "In What Channel should I send it?", required: false }}, //to use in the code: interacton.getChannel("what_channel")
        //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
        //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }}, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
        //{"StringChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", "botping"], ["Discord Api", "api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
    ],
    run: async (client, interaction) => {
        try {
            const rrchan = interaction.options.getChannel("channelid");
            const rrrole = interaction.options.getRole("roleid");
            const emojiID = interaction.options.getString("emoji");
            const messageid = interaction.options.getString("messageid");
            interaction.reply(messageid);
            if (!emojiID) {
                return interaction.reply("You have formatted this command incorrectly. (EMOJI MISSING) (See help rradd for more information).");
            }
            if (!messageid) {
                return interaction.reply("You have formatted this command incorrectly. (MESSAGE ID MISSING) (See help rradd for more information).");
            }
            if (!args[2]) {
                return interaction.reply("You have formatted this command incorrectly. (CHANNEL MISSING)(See help rradd for more information).");
            }
            if (!args[3]) {
                return interaction.reply("You have formatted this command incorrectly. (ROLE MISSING)(See help rradd for more information).");
            }
            if (emojiID != rrchan) {
                if (!emojiID != rrrole) {

                    client.getRr = rrsql.prepare("SELECT * FROM rrtable WHERE emoji = ?  AND guild = ? AND channel = ? AND messageid = ?");
                    client.addRr = rrsql.prepare("INSERT OR REPLACE INTO rrtable (id, emoji, guild, role, messageid, channel) VALUES (@id, @emoji, @guild, @role, @messageid, @rrchan);");
                    client.removeRr = rrsql.prepare("DELETE FROM rrtable WHERE emoji = ? AND guild = ? AND channel = ?");
                    let rr;
                    rr = client.getRr.get(emojiID, interaction.guild.id, rrchan, messageid);
                    if (!rr) {
                        score = { id: `${interaction.guild.id}-${emojiID}`, emoji: emojiID, guild: interaction.guild.id, role: rrrole, messageid: messageid, rrchan: rrchan }
                        client.addRr.run(score);
                        try {
                            let channel = interaction.mentions.channels.first();
                            //console.log(channel);
                            channel.messages.fetch(messageid).then(msg => msg.react(emojiID));
                            message.reply(`Added: ${emojiID}, reaction to <@&${rrrole}> on <#${rrchan}> for Message: ${messageid}`);
                        }
                        catch (err2) {
                            interaction.reply("There was an error! while reacting to the message!");
                            console.log(err2);
                        }

                        return;
                    } else {
                        return interaction.reply("This Reaction Role has already been added!");
                    }
                    // And we save it!


                } else {
                    return interaction.reply("You have formatted this command incorrectly. (CANNOT SET ROLE AS EMOJI) (See help rradd for more information).");
                }
            } else {
                return interaction.reply("You have formatted this command incorrectly. (CANNOT SET CHANNEL AS EMOJI) (See help rradd for more information).");
            }

        }
        catch (err) {
            interaction.reply("There was an error!");
            console.log(err);
            return;
        }

    }
};