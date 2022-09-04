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
module.exports = async (client, member) => {
    try {
        client.logchannel = botsql.prepare(`SELECT logchannel FROM settings WHERE guildid = '${member.guild.id}'`);
        if (client.logchannel.all().length) {
            const logchannel = member.guild.channels.cache.get(client.logchannel.get().logchannel);
            const guild = member.guild;
            if (member.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
                try {
                    const fetchedLogs = await member.guild.fetchAuditLogs({
                        limit: 1,
                        type: AuditLogEvent.MemberBanRemove,
                    });
                    const chLog = fetchedLogs.entries.first();
                    if (Date.now() - chLog.createdTimestamp < 5000) {
                        if (!chLog) {
                            var execute = "UNKNOWN";
                        }
                        const { executor, target } = chLog;
                        var execute = executor.tag;
                        var targ = target.username;
                    }
                    else {
                        var execute = "UNKNOWN";
                    }
                    const embed = new EmbedBuilder();
                    embed.setColor("#ff0000")
                    embed.setTitle('**MODERATION LOG: Member Unbanned**');
                    embed.addFields(
                        { name: 'Member UnBanned:', value: `${targ}`, inline: true },
                        { name: 'Executor', value: `${execute}`, inline: false },
                    )
                    embed.setTimestamp();

                    logchannel.send({ embeds: [embed] });
                    //console.log(`pin updated in a guild that has logs enabled!`);
                    //}

                    client.getBanned = bansql.prepare("SELECT * FROM bans WHERE user = ? AND guild = ?");
                    let globalBanned;
                    globalBanned = client.getBanned.get(member.user.id, member.guild.id);
                    if (globalBanned) {
                        bansql.prepare(`DELETE FROM 'bans' WHERE user = '${member.user.id}' AND guild = '${member.guild.id}'`).run()
                    }
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