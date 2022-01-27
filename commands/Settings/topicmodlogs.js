const {
    MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
    name: "topicmodlogs", //the command name for execution & for helpcmd [OPTIONAL]

    category: "Settings",
    aliases: ["topiclog"],
    usage: "topicmodlogs",

    cooldown: 10, //the command cooldown for execution & for helpcmd [OPTIONAL]
    description: "Defines if Topic Logs should be enabled on default or not!", //the command description for helpcmd [OPTIONAL]
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
            client.settings.ensure(guild.id, {
                defaultvolume: 50,
                defaultautoplay: false,
                defaultfilters: [`bassboost6`, `clear`]
            });

            client.settings.set(guild.id, !client.settings.get(guild.id, "topicmodlogs"), "topicmodlogs");
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(ee.color)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`${client.allEmojis.check_mark} **The Topic Mod Logs got __\`${client.settings.get(guild.id, "topicmodlogs") ? "Enabled" : "Disabled"}\`__!**`)
                ],
            })
        } catch (e) {
            const { logMessage } = require(`../../handlers/newfunctions`);
            logMessage(client, `error`, message.guild, `Error with TOPICMODLOGS command: ${e.message} | ${e.stack}`);
        }
    }
}
