const {
    MessageEmbed,
    Message,
    PermissionsBitField,
    AuditLogEvent,
    EmbedBuilder
} = require("discord.js");
const config = require(`../../configs/config.json`);
const Discord = require(`discord.js`);
const SQLite = require("better-sqlite3");
const bansql = new SQLite(`./databases/bans.sqlite`);
const botsql = new SQLite(`./databases/bot.sqlite`);
module.exports = async (client, emoji) => {
    try {
        client.logchannel = botsql.prepare(`SELECT settings.settingValue FROM settings WHERE setting = 'logchannel' AND guildid = '${emoji.guild.id}'`);
        const logchannel = emoji.guild.channels.cache.get(client.logchannel.get().settingValue);
        if (!logchannel.id == "") {
            const guild = emoji.guild;
            //console.log(channel.messages.messages);
            if (emoji.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
                try {
                    const embed = new EmbedBuilder();
                    embed.setColor("#00FF00")
                    embed.setTitle('**MODERATION LOG: EMOJI CREATED**');
                    embed.addFields(
                        { name: 'Emoji:', value: `${emoji.name}`, inline: true },
                        { name: 'Identifier', value: `${emoji.identifier}`, inline: false },
                        { name: 'Added by:', value: `${emoji.author}`, inline: false },
                    )
                    embed.setTimestamp();
                    logchannel.send({ content: `:${emoji.name}: Added`, embeds: [embed] });
                    //console.log(`pin updated in a guild that has logs enabled!`);
                    //}
                }
                catch (err) {
                    console.log(err);
                    return;
                }
            }
        }
    } catch (e) {
        console.log(e);
    }

};