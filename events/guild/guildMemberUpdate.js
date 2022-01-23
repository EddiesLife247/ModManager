const {
    MessageEmbed,
    Message
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require(`../../handlers/functions`);
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
    console.log(member);
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
                    member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel")).send({ embeds: [embed] });
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
                    client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${member.guild.name} triggered event: Timeout Successfully`);
                }
                return;

            }
            if (oldMember._roles == member._roles) {
                var roleChange = `No Role Changes`;
            } else {
                var oldRoles = ' - ';
                oldMember._roles.forEach(roledata => {
                    var role = member.guild.roles.cache.find(r => r.id == roledata);
                    oldRoles += `>${role.name} \n`;

                });
                var newRoles = ' - ';
                member._roles.forEach(roledata => {
                    var role = member.guild.roles.cache.find(r => r.id == roledata);
                    newRoles += `>${role.name} \n`;
                });
            }

            const embed = new Discord.MessageEmbed()
                .setAuthor(`Modlogs`, member.guild.iconURL())
                .setColor("#ff0000")
                .setFooter(member.guild.name, member.guild.iconURL())
                .setTitle("**Moderation** - Member Updated")
                .addField("**Member**", `>*${member.user.tag}*`, true)
                .addField("**Avatar Changes:**", `>*${avatarChange}*`, true)
                .addField("**Username Changes:**", `>*${usernameChange}*`, true)
                .addField("**Discrimintor Changes:**", `>*${discriminatorChange}*`, true)
                .addField("**Nickname Changes:**", `>*${nicknameChange}*`, true)
            if (roleChange == "") {
                embed.addField("**Old Roles:**", `>*${oldRoles}*`, true)
                    .addField("**New Roles:**", `>*${newRoles}*`, true)
            }
            embed.setTimestamp();
            member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel")).send({ embeds: [embed] });
            client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${member.guild.name} triggered event: GuildMemberUpdate Successfully`);
            //client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${member.guild.name} triggered event: GuildMemberUpdate Successfully`);
            //console.log(`Found log channel and sent message: ${settings.modLogChannel} in ${member.guild.id}`);
        }
    }

};
