const {
    MessageEmbed,
    Message,
    PermissionsBitField,
    AuditLogEvent,
    EmbedBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ButtonBuilder,
} = require("discord.js");
const config = require(`../../configs/config.json`);
const Discord = require(`discord.js`);
const SQLite = require("better-sqlite3");
const bansql = new SQLite(`./databases/bans.sqlite`);
const botsql = new SQLite(`./databases/bot.sqlite`);
module.exports = async (client, member) => {
    console.log(`Ban Added on guild: ${member.guild.name}`);
    client.addBan = bansql.prepare("INSERT INTO bans (id, user, guild, reason, approved, appealed, date, length) VALUES (@id, @user, @guild, @reason, @approved, 'No', datetime('now'), 60);");
    try {
        client.logchannel = botsql.prepare(`SELECT logchannel FROM settings WHERE guildid = '${member.guild.id}'`);
        if (client.logchannel.all().length) {
            const logchannel = member.guild.channels.cache.get(client.logchannel.get().logchannel);
            const guild = member.guild;
            if (logchannel == null) {
                return;
            }
            if (member.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
                try {
                    const fetchedLogs = await member.guild.fetchAuditLogs({
                        limit: 1,
                        type: AuditLogEvent.MemberBanAdd,
                    });
                    const chLog = fetchedLogs.entries.first();
                    console.log(chLog);
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
                    const row = new ActionRowBuilder();
                    logchannel.send({ embeds: [embed] });
                    if (!chLog.reason) {
                        let banid = Math.floor(Math.random() * 9999999999) + 25;
                        let banReason = "LOCAL BAN"
                        let banApproved = "LOCAL"
                        score = { id: `${member.user.id}-${banid}`, user: member.user.id, guild: member.guild.id, reason: banReason, approved: banApproved };
                        client.addBan.run(score);
                        const approveButton = new ButtonBuilder()
                        .setLabel(`Change to GLOBAL`)
                        .setCustomId(`${member.user.id}-${banid}-APPROVE`)
                        .setDisabled(false)
                        .setColor(ButtonStyle.Success)
                    const denyButton = new ButtonBuilder()
                        .setLabel(`Set to LOCAL`)
                        .setCustomId(`${member.user.id}-${banid}-DENY`)
                        .setDisabled(true)
                        .setColor(ButtonStyle.Danger)
                    row.addComponents(approveButton, denyButton);

                    }
                    else if (chLog.reason.toLowerCase().includes("nitro")) {
                        let banid = Math.floor(Math.random() * 9999999999) + 25;
                        let banReason = chLog.reason
                        let banApproved = "GLOBAL"
                        score = { id: `${member.user.id}-${banid}`, user: member.user.id, guild: member.guild.id, reason: banReason, approved: banApproved };
                        client.addBan.run(score);
                        const approveButton = new ButtonBuilder()
                            .setLabel(`Approve Global Ban`)
                            .setCustomId(`${member.user.id}-${banid}-APPROVE`)
                            .setDisabled(true)
                            .setColor(ButtonStyle.Success)
                        const denyButton = new ButtonBuilder()
                            .setLabel(`Set to LOCAL`)
                            .setCustomId(`${member.user.id}-${banid}-DENY`)
                            .setDisabled(false)
                            .setColor(ButtonStyle.Danger)
                        row.addComponents(approveButton, denyButton);
                    } else if (chLog.reason.toLowerCase().includes("advertising")) {
                        let banid = Math.floor(Math.random() * 9999999999) + 25;
                        let banReason = chLog.reason
                        let banApproved = "GLOBAL"
                        score = { id: `${member.user.id}-${banid}`, user: member.user.id, guild: member.guild.id, reason: banReason, approved: banApproved };
                        client.addBan.run(score);
                        const approveButton = new ButtonBuilder()
                            .setLabel(`Approve Global Ban`)
                            .setCustomId(`${member.user.id}-${banid}-APPROVE`)
                            .setDisabled(true)
                            .setColor(ButtonStyle.Success)
                        const denyButton = new ButtonBuilder()
                            .setLabel(`Set to LOCAL`)
                            .setCustomId(`${member.user.id}-${banid}-DENY`)
                            .setDisabled(false)
                            .setColor(ButtonStyle.Danger)
                        row.addComponents(approveButton, denyButton);
                    } else if (chLog.reason.toLowerCase().includes("scam")) {
                        let banid = Math.floor(Math.random() * 9999999999) + 25;
                        let banReason = chLog.reason
                        let banApproved = "GLOBAL"
                        score = { id: `${member.user.id}-${banid}`, user: member.user.id, guild: member.guild.id, reason: banReason, approved: banApproved };
                        client.addBan.run(score);
                        const approveButton = new ButtonBuilder()
                            .setLabel(`Approve Global Ban`)
                            .setCustomId(`${member.user.id}-${banid}-APPROVE`)
                            .setDisabled(true)
                            .setColor(ButtonStyle.Success)
                        const denyButton = new ButtonBuilder()
                            .setLabel(`Set to LOCAL`)
                            .setCustomId(`${member.user.id}-${banid}-DENY`)
                            .setDisabled(false)
                            .setColor(ButtonStyle.Danger)
                        row.addComponents(approveButton, denyButton);
                    } else {
                        let banid = Math.floor(Math.random() * 9999999999) + 25;
                        let banReason = chLog.reason
                        let banApproved = "PENDING"
                        score = { id: `${member.user.id}-${banid}`, user: member.user.id, guild: member.guild.id, reason: banReason, approved: banApproved };
                        client.addBan.run(score);
                        const approveButton = new ButtonBuilder()
                            .setLabel(`Approve Global Ban`)
                            .setCustomId(`${member.user.id}-${banid}-APPROVE`)
                            .setDisabled(false)
                            .setColor(ButtonStyle.Success)
                        const denyButton = new ButtonBuilder()
                            .setLabel(`Deny Global Ban`)
                            .setCustomId(`${member.user.id}-${banid}-DENY`)
                            .setDisabled(false)
                            .setColor(ButtonStyle.Danger)
                        row.addComponents(approveButton, denyButton);
                    }


                    client.guilds.cache.get("787871047139328000").channels.cache.get("1017361857528483880").send({ content: `BAN ADDED: Member: ${member.user.username} | ${member.guild.name} | Status: ${banApproved} \`\`\` ${banReason} \`\`\``, components: [row] });
                    //console.log(`pin updated in a guild that has logs enabled!`);
                    //}
                } catch (err) {
                    console.log(err);
                    client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
                    return;
                }
            }
        } else {
            let BannedReason = '';
            let banApproved = "";
            if (member.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {

                try {
                    const fetchedLogs = await member.guild.fetchAuditLogs({
                        limit: 1,
                        type: AuditLogEvent.MemberBanAdd,
                    });
                    const chLog = fetchedLogs.entries.first();
                    if (Date.now() - chLog.createdTimestamp < 5000) {
                        BannedReason = chLog.reason;
                        banApproved = 'PENDING';
                    }
                } catch (error) {
                    console.log(error);

                }
            } else {
                BannedReason = 'No Access to view logs/reasons';
                banApproved = 'LOCAL';
            }
            let banid = Math.floor(Math.random() * 9999999999) + 25;
            const row = new ActionRowBuilder();
            const approveButton = new ButtonBuilder()
                .setLabel(`Make Global Ban`)
                .setCustomId(`${member.user.id}-${banid}-APPROVE`)
                .setDisabled(false)
                .setColor(ButtonStyle.Success)
            const denyButton = new ButtonBuilder()
                .setLabel(`Deny Global Ban`)
                .setCustomId(`${member.user.id}-${banid}-DENY`)
                .setDisabled(false)
                .setColor(ButtonStyle.Danger)
            row.addComponents(approveButton, denyButton);
            score = { id: `${member.user.id}-${banid}`, user: member.user.id, guild: member.guild.id, reason: BannedReason, approved: banApproved };
            client.addBan.run(score);
            client.guilds.cache.get("787871047139328000").channels.cache.get("1017361857528483880").send({ content: `BAN ADDED: Member: ${member.user.username} | ${member.guild.name} | Status: ${banApproved} \`\`\` ${BannedReason} \`\`\``, components: [row] });
        }
    } catch (err) {
        console.log(err);
        client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
        return;
    }

};