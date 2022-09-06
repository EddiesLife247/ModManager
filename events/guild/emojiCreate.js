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
        client.logchannel = botsql.prepare(`SELECT logchannel FROM settings WHERE guildid = '${emoji.guild.id}'`);
        if (client.logchannel.all().length) {
            const logchannel = emoji.guild.channels.cache.get(client.logchannel.get().logchannel);
            const guild = emoji.guild;
            if(logchannel == null){
                return;
            }
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
                } catch (err) {
                    console.log(err);
                    client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
                    return;
                }
            }
        }
    } catch (err) {
        console.log(err);
        client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
        return;
    }

};