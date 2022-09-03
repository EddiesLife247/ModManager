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
const { timeout } = require("tmi.js/lib/commands");
const bansql = new SQLite(`./databases/bans.sqlite`);
const botsql = new SQLite(`./databases/bot.sqlite`);
module.exports = async (client, member) => {
    try {
        client.logchannel = botsql.prepare(`SELECT logchannel FROM settings WHERE guildid = '${member.guild.id}'`);
        const logchannel = member.guild.channels.cache.get(client.logchannel.get().logchannel);
        if (member.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
            try {
                const fetchedLogs = await member.guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.MemberKick,
                });
                const chLog = fetchedLogs.entries.first();
                if (Date.now() - chLog.createdTimestamp < 5000) {
                    if (!chLog) {
                        var execute = "UNKNOWN";
                    }
                    const { executor, target } = chLog;
                    var execute = executor.tag;
                    if (target.id === member.id) {
                        
                        var execute = executor.tag;
                        let banid = Math.floor(Math.random() * 9999999999) + 25;
                        if (kickLog.reason) {
                            kickReason = kickLog.reason;
                        } else {
                            kickReason = "No Reason Given";
                        }
                        score = { id: `${member.user.id}-${banid}`, user: member.user.id, guild: member.guild.id, reason: kickReason, approved: 'KICK' };
                        //user kicked log to kick logs
                        const KickCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'KICK' AND user = ${member.id}  AND guild = ${member.guild.id}`).all();
                        client.globalbans = botsql.prepare(`SELECT globalbans FROM settings WHERE guildid = '${member.guild.id}'`);
                        kickBans = client.globalbans.get().globalbans;
                        if (client.settings.get(member.guild.id, "kickban") == "0" || client.settings.get(member.guild.id, "kickban") == null) {
                            client.addBan.run(score);
                            logMessage(client, "success", member.guild, `${member.user.tag} was kicked, added to punsihment db`);
                        }
                        else if (KickCount.length > kickBans) {
                            //member = await member.guild.members.cache.get(member.id);
                            member.guild.members.ban(member.id, { reason: `You were kicked ${KickCount.length} times within the last 30 days` });
                            let banid = Math.floor(Math.random() * 9999999999) + 25;
                            let banReason = "[AUTO] User Exceeded Kick Ban Limit on Guild"
                            let banApproved = "LOCAL"
                            client.addBan = bansql.prepare("INSERT INTO bans (id, user, guild, reason, approved, appealed, date, length) VALUES (@id, @user, @guild, @reason, @approved, 'No', datetime('now'), 60);");
                            score = { id: `${member.id}-${banid}`, user: member.id, guild: member.guild.id, reason: banReason, approved: banApproved };
                            client.addBan.run(score);
                            logMessage(client, "success", member.guild, `${member.user.tag} was kicked and banned, added to punsihment db`);
                            return;

                        } else {
                            client.addBan.run(score);
                        }
                    } else {
                        var execute = "UNKNOWN";
                        kickReason = "Unknown / Maybe Left?";
                    }
                }
                else {
                    var execute = "UNKNOWN";
                }
                const embed = new EmbedBuilder();
                embed.setColor("#ff0000")
                embed.setTitle('**MODERATION LOG: MEMBER LEFT**');
                embed.addFields(
                    { name: 'Username:', value: `${member.user.username}`, inline: true },
                    { name: 'Reason', value: `${kickReason}`, inline: false },
                    { name: 'User', value: `${execute}`, inline: false },
                )
                embed.setTimestamp();
                if (client.logchannel.get().logchannel) {
                    logchannel.send({ embeds: [embed] });
                }
                //console.log(`pin updated in a guild that has logs enabled!`);
                //}
            }
            catch (err) {
                console.log(err);
                return;
            }
        } else {
            if (client.logchannel.get().logchannel) {
                const embed = new EmbedBuilder();
                embed.setColor("#ff0000")
                embed.setTitle('**MODERATION LOG: MEMBER LEFT**');
                embed.addFields(
                    { name: 'Username::', value: `${member.user.username}`, inline: true },
                    { name: 'Reason:', value: `We don't have access to view Logs, so not sure.`, inline: false },
                )
                logchannel.send({ embeds: [embed] });
            }
        }

    } catch (error) {
        console.log(error);
    }
}