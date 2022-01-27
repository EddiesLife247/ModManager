const {
    MessageEmbed,
    Message
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require(`../../handlers/functions`);
const { logMessage } = require(`../../handlers/newfunctions`);
const Discord = require(`discord.js`);
const SQLite = require("better-sqlite3");
const bansql = new SQLite(`./databases/bans.sqlite`);
module.exports = async (client, member) => {

    const guild = member.guild;
    if (guild.me.permissions.has("VIEW_AUDIT_LOG")) {
        //if (member.me.permissions.has("VIEW_AUDIT_LOG")) {
        client.addBan = bansql.prepare("INSERT INTO bans (id, user, guild, reason, approved, appealed, date, length) VALUES (@id, @user, @guild, @reason, @approved, 'No', datetime('now'), 60);");
        client.settings.ensure(member.guild.id, {
            prefix: config.prefix,
            defaultvolume: 50,
            defaultautoplay: false,
            defaultfilters: [`bassboost6`, `clear`],
            djroles: [],
            botchannel: [],
            logxhannel: [],
        })
        // Load the guild's settings
        //console.log("Ban Detected!");
        //console.log(member)
        //console.log(ban);
        if (member.guild.me.permissions.has("VIEW_AUDIT_LOG")) {

            const fetchedLogs = await member.guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_BAN_ADD',
            });
            //console.log(fetchedLogs);
            const banLog = fetchedLogs.entries.first();
            if (!banLog) return console.log(`${member.user.tag} left the guild, most likely of their own will.`);
            const { executor, target } = banLog;
            if (target.id === member.id) {
                var executorKick = "UNKNOWN";
            }
            else {
                var executorKick = executor.tag;
            }
            client.features.ensure(member.guild.id, {
                music: true,
                logs: true,
                reactionroles: true,
                moderation: true,
                fun: true,
                youtube: false,
                support: true,
                points: true,
            });
            if (client.features.get(member.guild.id, "logs") == true) {
            if (member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel"))) {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(`Modlogs`, member.guild.iconURL())
                    .setColor("#ff0000")
                    .setFooter(member.guild.name, member.guild.iconURL())
                    .setTitle("**Moderation** - Member Banned")
                    .addField("**Member**", `${member.user.tag}`, true)
                    .addField("**Executor**", `${executorKick}`, true)
                    .addField("**Reason**", `${banLog.reason}`)
                    .setTimestamp();
                member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel")).send({ embeds: [embed] });
            }
        }
            let banReason = ''
            let banApproved = ''
            if (executor.id == client.user.id) {
                console.log("User joined a server but has been global banned.");
                //do nothing as they are already banned by the bot!
            } else {
                //console.log(banLog);
                if (!banLog.reason) {
                    let banid = Math.floor(Math.random() * 9999999999) + 25;
                    let banReason = "LOCAL BAN"
                    let banApproved = "LOCAL"
                    score = { id: `${member.user.id}-${banid}`, user: member.user.id, guild: member.guild.id, reason: banReason, approved: banApproved };
                    client.addBan.run(score);
                }
                else if (banLog.reason.toLowerCase().includes("nitro")) {
                    let banid = Math.floor(Math.random() * 9999999999) + 25;
                    let banReason = banLog.reason
                    let banApproved = "GLOBAL"
                    score = { id: `${member.user.id}-${banid}`, user: member.user.id, guild: member.guild.id, reason: banReason, approved: banApproved };
                    client.addBan.run(score);
                    logMessage(client, "success", member.guild, "Global Ban Added - Scams/Nitro");
                } else {
                    let banid = Math.floor(Math.random() * 9999999999) + 25;
                    let banReason = banLog.reason
                    let banApproved = "PENDING"
                    score = { id: `${member.user.id}-${banid}`, user: member.user.id, guild: member.guild.id, reason: banReason, approved: banApproved };
                    client.addBan.run(score);
                    logMessage(client, "success", member.guild, `New Global PENDING ban from \n \n ${member.guild.name}`);
                }
            }
            client.features.ensure(member.guild.id, {
                music: true,
                logs: true,
                reactionroles: true,
                moderation: true,
                fun: true,
                youtube: false,
                support: true,
                points: true,
            });
            if (client.features.get(member.guild.id, "logs") == true) {
            if (member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel"))) {
                member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel")).send('Ban added to punishment database and will be reviewed by bot staff shortly');
            }
        }
            //console.log(`Found log channel and sent message: ${settings.modLogChannel} in ${member.guild.id}`);
            logMessage(client, "success", member.guild, `New Local ban from \n \n ${member.guild.name}`);

        }
        else {
            let banid = Math.floor(Math.random() * 9999999999) + 25;
            let banReason = "LOCAL BAN - No Audit Log Permissions"
            let banApproved = "LOCAL"
            score = { id: `${member.user.id}-${banid}`, user: member.user.id, guild: member.guild.id, reason: banReason, approved: banApproved };
            client.addBan.run(score);
            logMessage(client, "successfully with issues", member.guild, `New Local ban - NO AUDIT PERMISSIONS from \n \n ${member.guild.name}`);

            //console.log(`member joined guild that has logs disabled!`);
            return;
        }
    }
    //}
};
