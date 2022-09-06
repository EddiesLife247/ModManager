const { EmbedBuilder, Collection, PermissionsBitField, AuditLogEvent } = require('discord.js')
const ms = require('ms');
const config = require('../../configs/config.json');
const SQLite = require("better-sqlite3");
const e = require('express');
var Filter = require('bad-words'),
    filter = new Filter();
const cooldown = new Collection();
const scoresql = new SQLite(`./databases/scores.sqlite`);
const bansql = new SQLite(`./databases/bans.sqlite`);
const botsql = new SQLite(`./databases/bot.sqlite`);
module.exports = async (client, oldMessage, newMessage) => {
    try {
        //console.log(oldMessage);
        client.setup = botsql.prepare(`SELECT * FROM settings WHERE guildid = '${newMessage.guild.id}'`);
        if (!client.setup.all().length) {
           // console.log(`${newMessage.guild.name} - Is not setup! (MessageUpdate)`);
            return;
        }
        client.logchannel = botsql.prepare(`SELECT logchannel FROM settings WHERE guildid = '${newMessage.guild.id}'`);
        if (client.logchannel.get().logchannel) {
            const logchannel = newMessage.guild.channels.cache.get(client.logchannel.get().logchannel);
            const guild = newMessage.guild;
            if (newMessage.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
                // LOGS HERE
                try {
                    //console.log(oldMessage);
                    const embed = new EmbedBuilder();
                    embed.setColor("#0000ff")
                    embed.setTitle('**MODERATION LOG: Message Changed**');
                    embed.addFields(
                        { name: 'Channel:', value: `<#${newMessage.channel.id}>`, inline: true },
                        { name: 'Author:', value: `<@${newMessage.author.id}>`, inline: true },
                        { name: 'Message ID?', value: `${newMessage.id}`, inline: true },
                        { name: 'Old Pinned status', value: `${oldMessage.pinned}`, inline: true },
                        { name: 'New Pinned status', value: `${newMessage.pinned}`, inline: true },
                        { name: 'Old Message Content:', value: `>${oldMessage.content}`, inline: false },
                        { name: 'New Message Content:', value: `>${newMessage.content}`, inline: false },

                    )
                    embed.setURL(`https://ptb.discord.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id}`)
                    embed.setTimestamp();

                    logchannel.send({ embeds: [embed] });
                    //console.log(`pin updated in a guild that has logs enabled!`);
                    //}
                } catch (err) {
                    console.log(err);
                    client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
                    return;
                }

            }
        }
        console.log(`Message Uppdated in: ${newMessage.guild.name} : ${newMessage.channel.name}.`);

    } catch (err) {
        console.log(err);
        client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
        return;
    }

};
