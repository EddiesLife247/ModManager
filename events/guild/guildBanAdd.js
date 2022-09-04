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
    console.log("Ban Added");
    client.addBan = bansql.prepare("INSERT INTO bans (id, user, guild, reason, approved, appealed, date, length) VALUES (@id, @user, @guild, @reason, @approved, 'No', datetime('now'), 60);");
    try {
        client.logchannel = botsql.prepare(`SELECT logchannel FROM settings WHERE guildid = '${member.guild.id}'`);
        if (client.logchannel.all().length) {
            const logchannel = member.guild.channels.cache.get(client.logchannel.get().logchannel);
            const guild = member.guild;
            if (member.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
                try {
                    const fetchedLogs = await member.guild.fetchAuditLogs({
                        limit: 1,
                        type: AuditLogEvent.MemberBanAdd,
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
                    //console.log(logchannel.id);
                    const embed = new EmbedBuilder();
                    embed.setColor("#00ff00")
                    embed.setTitle('**MODERATION LOG: Member Banned**');
                    embed.addFields(
                        { name: 'Member Banned:', value: `${targ}`, inline: true },
                        { name: 'Executor', value: `${execute}`, inline: false },
                        { name: 'Reason', value: `${chLog.reason}`, inline: false },
                    )
                    embed.setTimestamp();

                    logchannel.send({ embeds: [embed] });
                    if (!chLog.reason) {
                        let banid = Math.floor(Math.random() * 9999999999) + 25;
                        let banReason = "LOCAL BAN"
                        let banApproved = "LOCAL"
                        score = { id: `${member.user.id}-${banid}`, user: member.user.id, guild: member.guild.id, reason: banReason, approved: banApproved };
                        client.addBan.run(score);
                    }
                    else if (chLog.reason.toLowerCase().includes("nitro")) {
                        let banid = Math.floor(Math.random() * 9999999999) + 25;
                        let banReason = chLog.reason
                        let banApproved = "GLOBAL"
                        score = { id: `${member.user.id}-${banid}`, user: member.user.id, guild: member.guild.id, reason: banReason, approved: banApproved };
                        client.addBan.run(score);
                    } else if (chLog.reason.toLowerCase().includes("advertising")) {
                        let banid = Math.floor(Math.random() * 9999999999) + 25;
                        let banReason = chLog.reason
                        let banApproved = "GLOBAL"
                        score = { id: `${member.user.id}-${banid}`, user: member.user.id, guild: member.guild.id, reason: banReason, approved: banApproved };
                        client.addBan.run(score);
                    } else {
                        let banid = Math.floor(Math.random() * 9999999999) + 25;
                        let banReason = chLog.reason
                        let banApproved = "PENDING"
                        score = { id: `${member.user.id}-${banid}`, user: member.user.id, guild: member.guild.id, reason: banReason, approved: banApproved };
                        client.addBan.run(score);
                    }
                    //console.log(`pin updated in a guild that has logs enabled!`);
                    //}
                } catch (err) {
                    console.log(err);
                    client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
                    return;
                }
            }
        } else {
            let banid = Math.floor(Math.random() * 9999999999) + 25;
            let banReason = 'No Access to view logs/reasons';
            let banApproved = "LOCAL"
            score = { id: `${member.user.id}-${banid}`, user: member.user.id, guild: member.guild.id, reason: banReason, approved: banApproved };
            client.addBan.run(score);
        }
    } catch (err) {
        console.log(err);
        client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
        return;
    }

};