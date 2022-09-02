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
module.exports = async (client, oldEmoji, newEmoji) => {
    try {
        client.logchannel = botsql.prepare(`SELECT settings.settingValue FROM settings WHERE setting = 'logchannel' AND guildid = '${oldEmoji.guild.id}'`);
        const logchannel = oldEmoji.guild.channels.cache.get(client.logchannel.get().settingValue);
        if (!logchannel.id == "") {
            const guild = oldEmoji.guild;
            //console.log(channel.messages.messages);
            if (oldEmoji.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
                try {
                    const embed = new EmbedBuilder();
                    embed.setColor("#0000FF")
                    embed.setTitle('**MODERATION LOG: EMOJI UPDATED**');
                    embed.addFields(
                        { name: 'Old Emoji:', value: `${oldEmoji.name}`, inline: true },
                        { name: 'New Emoji:', value: `${newEmoji.name}`, inline: true },
                        { name: 'Added by:', value: `${newEmoji.author}`, inline: true },
                        { name: 'Identifier', value: `${oldEmoji.identifier}`, inline: false },
                    )
                    embed.setTimestamp();
                    logchannel.send({ content: `:${newEmoji.name}: UPDATED`, embeds: [embed] });
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