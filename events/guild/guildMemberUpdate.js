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
module.exports = async (client, oldMember, member) => {
    client.settings.ensure(member.guild.id, {
        prefix: config.prefix,
        defaultvolume: 50,
        defaultautoplay: false,
        defaultfilters: [`bassboost6`, `clear`],
        djroles: [],
        botchannel: [],
        timeoutLength: "",
        logxhannel: [],
    })
    if (client.settings.get(member.guild.id, "timeoutLength") == "") {
        var timedout = 60;
    } else {
        var timedout = client.settings.get(member.guild.id, "timeoutLength");
    }
    // Load the guild's settings
    //console.log(oldMember._roles);
    const guild = member.guild;
    var Changes = {
        unknown: 0,
        addedRole: 1,
        removedRole: 2,
        username: 3,
        nickname: 4,
        avatar: 5
    }
    var change = Changes.unknown
    if (guild.me.permissions.has("VIEW_AUDIT_LOG")) {
        //console.log("test");
        if (client.settings.get(member.guild.id, "logchannel") == "") return;
        if (member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel"))) {

            // CHECK IF ANY CHANGES
            if (oldMember.nickname == member.nickname) {
                if (member.nickname == '') {
                    var nicknameChange = "No Nickname";
                } else {
                    var nicknameChange = `>${member.nickname}`;
                }
            } else {
                var nicknameChange = `>${oldMember.nickname} > ${member.nickname}`;
            }
            if (oldMember.user.avatar == member.user.avatar) {
                var avatarChange = `>${member.user.avatar}`;
            } else {
                var avatarChange = `>${oldMember.user.avatar} > ${member.user.avatar}`;
            }
            if (oldMember.user.discriminator == member.user.discriminator) {
                var discriminatorChange = `>${member.user.discriminator}`;
            } else {
                var discriminatorChange = `>${oldMember.user.discriminator} > ${member.user.discriminator}`;
            }
            if (oldMember.user.username == member.user.username) {
                var usernameChange = `>${member.user.username}`;
            } else {
                var usernameChange = `>${oldMember.user.username} > ${member.user.username}`;
            }
            if (oldMember.communicationDisabledUntilTimestamp > member.communicationDisabledUntilTimestamp) {
                if (member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel"))) {
                    const fetchedLogs = await member.guild.fetchAuditLogs({
                        limit: 1,
                        type: 'MEMBER_UPDATE',
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
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(`Modlogs`, member.guild.iconURL())
                        .setColor("#ff0000")
                        .setFooter(member.guild.name, member.guild.iconURL())
                        .setTitle("**Moderation** - Member Timedout Removed!")
                        .addField("**Member**", `${member.user.tag}`, true)
                        .addField("**Executor**", `${executorKick}`, true)
                        .addField("**Reason**", `${banLog.reason}`)
                        .setTimestamp();
                        logMessage(client, "success", member.guild, "Member Timeout Removed Log Message");
                }
                return;
            }
            if (!member.communicationDisabledUntilTimestamp == '') {
                client.addBan = bansql.prepare("INSERT INTO bans (id, user, guild, reason, approved, appealed, date, length) VALUES (@id, @user, @guild, @reason, @approved, 'No', datetime('now'), 15);");
                if (member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel"))) {
                    const fetchedLogs = await member.guild.fetchAuditLogs({
                        limit: 1,
                        type: 'MEMBER_UPDATE',
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
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(`Modlogs`, member.guild.iconURL())
                        .setColor("#ff0000")
                        .setFooter(member.guild.name, member.guild.iconURL())
                        .setTitle("**Moderation** - Member Timedout!")
                        .addField("**Member**", `${member.user.tag}`, true)
                        .addField("**Executor**", `${executorKick}`, true)
                        .addField("**Reason**", `${banLog.reason}`)
                        .setTimestamp();
                    member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel")).send({ embeds: [embed] });

                    let banid = Math.floor(Math.random() * 9999999999) + 25;
                    let banReason = banLog.reason
                    let banApproved = "TIMEOUT"
                    score = { id: `${member.user.id}-${banid}`, user: member.user.id, guild: member.guild.id, reason: banReason, approved: banApproved };
                    client.addBan.run(score);
                    logMessage(client, "success", member.guild, "Member Timeout Log Message");
                }
                return;

            }
            var removedRole = ''
            oldMember.roles.cache.forEach((value) => {
                if (!member.roles.cache.find((role) => role.id === value.id)) {
                 removedRole = value.name;
                }
               });
        
            var addedRole = ''
            member.roles.cache.forEach((value) => {
                if (!oldMember.roles.cache.find((role) => role.id === value.id)) {
                 addedRole = value.name;
                }
               });
            if (member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel"))) {
                const fetchedLogs = await member.guild.fetchAuditLogs({
                    limit: 1,
                    type: 'MEMBER_UPDATE',
                });
                //console.log(fetchedLogs);
                const banLog = fetchedLogs.entries.first();
                if (!banLog) return;
                const { executor, target } = banLog;
                if (target.id === member.id) {
                    var executorKick = "UNKNOWN";
                }
                else {
                    var executorKick = executor.tag;
                }
            if(removedRole == addedRole) {
                var roles = "No Roles Changed"
                const embed = new Discord.MessageEmbed()
                .setColor("#ff0000")
                .setTitle("**Moderation** - Member Updated")
                .addField("**Member**", `*${member.user.tag}*`, true)
                .addField("**Avatar Changes:**", `*${avatarChange}*`, true)
                .addField("**Username Changes:**", `*${usernameChange}*`, true)
                .addField("**Discrimintor Changes:**", `*${discriminatorChange}*`, true)
                .addField("**Nickname Changes:**", `*${nicknameChange}*`, true)
                .addField("**Role Changes**", `${roles}`, true)
                .addField("**Executor**", `${executorKick}`, true)
                .setTimestamp();
                member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel")).send({ embeds: [embed] });
                logMessage(client, "success", member.guild, "Member Updated Log Message");
            } else {
                if(addedRole) {
                    const embed = new Discord.MessageEmbed()
                    .setColor("#ff0000")
                    .setTitle("**Moderation** - Member Updated")
                    .addField("**Member**", `*${member.user.tag}*`, true)
                    .addField("**Avatar Changes:**", `*${avatarChange}*`, true)
                    .addField("**Username Changes:**", `*${usernameChange}*`, true)
                    .addField("**Discrimintor Changes:**", `*${discriminatorChange}*`, true)
                    .addField("**Nickname Changes:**", `*${nicknameChange}*`, true)
                    .addField("**Added Roles**", `${addedRole}`, true)
                    .addField("**Executor**", `${executorKick}`, true)
                    .setTimestamp();
                    member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel")).send({ embeds: [embed] });
                    logMessage(client, "success", member.guild, "Member Updated (add role) Log Message");
                }
                if(removedRole) {
                    const embed = new Discord.MessageEmbed()
                    .setColor("#ff0000")
                    .setTitle("**Moderation** - Member Updated")
                    .addField("**Member**", `>*${member.user.tag}*`, true)
                    .addField("**Avatar Changes:**", `>*${avatarChange}*`, true)
                    .addField("**Username Changes:**", `>*${usernameChange}*`, true)
                    .addField("**Discrimintor Changes:**", `>*${discriminatorChange}*`, true)
                    .addField("**Nickname Changes:**", `>*${nicknameChange}*`, true)
                    .addField("**Removed Roles**", `>${removedRole}`, true)
                    .addField("**Executor**", `${executorKick}`, true)
                    .setTimestamp();
                    member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel")).send({ embeds: [embed] });
                    logMessage(client, "success", member.guild, "Member Updated (remove role) Log Message");
                }


            }
        }
        }
    }

};
