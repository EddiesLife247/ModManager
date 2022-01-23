const {
    MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
    name: "logchannel", //the command name for execution & for helpcmd [OPTIONAL]

    category: "Settings",
    aliases: ["logch"],
    usage: "logchannel <set> <#Channel>",

    cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
    description: "Manages the Log Channel!", //the command description for helpcmd [OPTIONAL]
    memberpermissions: ["MANAGE_GUILD "], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    run: async (client, message, args) => {
        try {
            //things u can directly access in an interaction!
            const {
                member,
                channelId,
                guildId,
                applicationId,
                commandName,
                deferred,
                replied,
                ephemeral,
                options,
                id,
                createdTimestamp
            } = message;
            const {
                guild
            } = member;

            if (!args[0]) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`${client.allEmojis.x} **Please add a Method+Channel!**`)
                        .setDescription(`**Usage:**\n> \`${client.settings.get(message.guild.id, "prefix")}logchannel <set> <#Channel>\``)
                    ],
                });
            }
            let add_remove = args[0].toLowerCase();
            if (!["set"].includes(add_remove)) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`${client.allEmojis.x} **Please add a Method+Channel!**`)
                        .setDescription(`**Usage:**\n> \`${client.settings.get(message.guild.id, "prefix")}logchannel <set> <#Channel>\``)
                    ],
                });
            }
            let Channel = message.mentions.channels.first();
            if (!Channel) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`${client.allEmojis.x} **Please add a Method+Channel!**`)
                        .setDescription(`**Usage:**\n> \`${client.settings.get(message.guild.id, "prefix")}logchannel <set> <#Channel>\``)
                    ],
                });
            }
            client.settings.ensure(guild.id, {
                logchannel: []
            });

            if (add_remove == "set") {
                if (client.settings.get(guild.id, "logchannel").includes(Channel.id)) {
                    return message.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(ee.wrongcolor)
                                .setFooter(ee.footertext, ee.footericon)
                                .setTitle(`${client.allEmojis.x} **This Channel is already set as the Log Channe!**`)
                        ],
                    })
                }
                client.settings.push(guild.id, Channel.id, "logchannel");
                var djs = client.settings.get(guild.id, `logchannel`).map(r => `<#${r}>`);
                if (djs.length == 0) djs = "`not setup`";
                else djs.join(", ");
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(ee.color)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(`${client.allEmojis.check_mark} **The Channel \`${Channel.name}\` got set to the Bot Log Channel!**`)
                            .addField(`**Log-Channel${client.settings.get(guild.id, "logchannel").length > 1 ? "s" : ""}:**`, `>>> ${djs}`, true)
                    ],
                })
            }
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
