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
        if (client.logchannel.all().length) {
            const logchannel = member.guild.channels.cache.get(client.logchannel.get().logchannel);
            var trustlevel = 0;
            var reason = "";
            const Discord_Employee = 1;
            const Partnered_Server_Owner = 2;
            const HypeSquad_Events = 4;
            const Bug_Hunter_Level_1 = 8;
            const House_Bravery = 64;
            const House_Brilliance = 128;
            const House_Balance = 256;
            const Early_Supporter = 512;
            const Bug_Hunter_Level_2 = 16384;
            const Early_Verified_Bot_Developer = 131072;
            const flags = member.user.public_flags;
            if (Date.now() - member.user.createdAt < 1000 * 60 * 60 * 24 * 10) {
                trustlevel = trustlevel - 1;
                reason = reason + `\n Trust level now: ${trustlevel} action: -1 reason: Account younger than 10 days`;
            } else {
                trustlevel = trustlevel + 5;
                reason = reason + `\n Trust level now: ${trustlevel} action: +5 reason: Account older than 10 days`;
            }
            if (Date.now() - member.user.createdAt > 1000 * 60 * 60 * 24 * 365) {
                trustlevel = trustlevel + 5;
                reason = reason + `\n Trust level now: ${trustlevel} action: +5 reason: Account older than 1 year(s)`;
            } else {
                trustlevel = trustlevel - 1;
                reason = reason + `\n Trust level now: ${trustlevel} action: -1 reason: Account younger than 1 year old`;

            }
            if ((flags & Discord_Employee) == Discord_Employee) {
                trustlevel = trustlevel + 5;
                reason = reason + `\n Trust level now: ${trustlevel} action: +5 reason: You are a discord employee`;
            }
            else {
                trustlevel = trustlevel - 1;
                reason = reason + `\n Trust level now: ${trustlevel} action: -1 reason: You are a not discord employee`;
            }
            if ((flags & Early_Supporter) == Early_Supporter) {
                trustlevel = trustlevel + 5;
                reason = reason + `\n Trust level now: ${trustlevel} action: +5 reason: You are an early supporter`;

            }
            else {
                trustlevel = trustlevel - 1;
                reason = reason + `\n Trust level now: ${trustlevel} action: -1 reason: You are a not an early supporter`;
            }
            if ((flags & Early_Verified_Bot_Developer) == Early_Verified_Bot_Developer) {
                trustlevel = trustlevel + 5;
                reason = reason + `\n Trust level now: ${trustlevel} action: +5 reason: You are a verified bot developer`;

            }
            else {
                trustlevel = trustlevel - 1;
                reason = reason + `\n Trust level now: ${trustlevel} action: -1 reason: You are not a verified bot developer`;
            }
            if (member.user.avatar) {
                trustlevel = trustlevel + 5;
                reason = reason + `\n Trust level now: ${trustlevel} action: +5 reason: You have an avatar`;
            }
            else {
                trustlevel = trustlevel - 1;
                reason = reason + `\n Trust level now: ${trustlevel} action: -1 reason: You do not have an avatar`;
            }
            if (localBanCount.length < 1) {
                trustlevel = trustlevel + 5;
                reason = reason + `\n Trust level now: ${trustlevel} action: +5 reason: You do not have any active bans on record.`;
            }
            else {
                trustlevel = trustlevel - localBanCount.length;
                reason = reason + `\n Trust level now: ${trustlevel} action: -${localBanCount.length} reason: You have active bans on record`;
            }
            if (warningCount < 1) {
                trustlevel = trustlevel + 5;
                reason = reason + `\n Trust level now: ${trustlevel} action: +5 reason: You do not have any active warnings on record.`;
            }
            else {
                trustlevel = trustlevel - warningCount.length;
                reason = reason + `\n Trust level now: ${trustlevel} action: -${warningCount.length} reason: You have active warnings on record`;
            }
            if (timeoutCount < 1) {
                trustlevel = trustlevel + 5;
                reason = reason + `\n Trust level now: ${trustlevel} action: +5 reason: You do not have any active timeout's on record.`;
            }
            else {
                trustlevel = trustlevel - timeoutCount.length;
                reason = reason + `\n Trust level now: ${trustlevel} action: -${timeoutCount.length} reason: You have active timeout's on record`;
            }
            if (KickCount < 1) {
                trustlevel = trustlevel + 5;
                reason = reason + `\n Trust level now: ${trustlevel} action: +5 reason: You do not have any active kick's on record.`;
            }
            else {
                trustlevel = trustlevel - KickCount.length;
                reason = reason + `\n Trust level now: ${trustlevel} action: -${KickCount.length} reason: You have active kick's on record`;
            }
            if (globalBanCount < 1) {
                trustlevel = trustlevel + 5;
                reason = reason + `\n Trust level now: ${trustlevel} action: +5 reason: You do not have any active global ban's on record.`;
            }
            else {
                trustlevel = trustlevel - globalBanCount.length;
                reason = reason + `\n Trust level now: ${trustlevel} action: -${globalBanCount.length} reason: You have active global ban's on record`;
            }
            client.acceptedtrust = botsql.prepare(`SELECT acceptedtrust FROM settings WHERE guildid = '${member.guild.id}'`);
            if (client.acceptedtrust.get().acceptedtrust) {
                const acceptedtrust = client.acceptedtrust.get().acceptedtrust;
                if (acceptedtrust >= trustlevel) {
                    if (member.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
                        await member.send(`Sorry you do not meet the acceptable trust level requirements for this server! The reasons you did not meet this requirement were: ${reason}`);
                        member.kick(`[AUTO] User does not meet accepted trust level for this server.`);
                    }

                }
            } else {
                acceptedtrust = "Disabled on this server";
            }
            client.getBanned = bansql.prepare("SELECT * FROM bans WHERE user = ?  AND approved = 'GLOBAL' AND appealed = 'No'");
            let globalBanned;
            globalBanned = client.getBanned.get(member.user.id);
            client.modchannel = botsql.prepare(`SELECT modchannel FROM settings WHERE guildid = '${member.guild.id}'`);
            const staffchan = member.guild.channels.cache.get(client.modchannel.get().modchannel);
            if (globalBanned) {
                // Check if user has joined support server
                if (member.guild.id == '787871047139328000') {
                    //if so set their role to the "GLOBAL BANNED" role.
                    var role = member.guild.roles.cache.find(role => role.id === "901933035342159932");
                    member.roles.add(role.id);
                    logMessage(client, "success", member.guild, `${member.user.tag} Attempted to join, but was removed due to Being Global Banned`);
                } else {
                    client.globalbans = botsql.prepare(`SELECT globalbans FROM settings WHERE guildid = '${member.guild.id}'`);
                    if (client.globalbans.get().globalbans == '1') {

                        // DO THIS
                        if (client.modchannel.get().modchannel) {
                            staffchan.send(`${member.user.tag} - Recently Joined and has been added to the global ban database. \n \n They were banned for: \`\`\` ${globalBanned.reason}\`\`\` The user will now be banned from this guild.`)
                        }
                        else {
                            if (client.logchannel.get().logchannel) {
                                logchannel.send(`** WARNING: ** ${member.user.tag} - Recently Joined and has been added to the global ban database. \n \n They were banned for: \`\`\` ${globalBanned.reason}\`\`\` `)
                            }
                        }
                        await member.send(`**Hello, You Have Been Banned From ${member.guild.name} ** GLOBAL BAN IN FORCE** \n \n To appeal this ban please visit our support server: https://discord.gg/ZqUSVpDcRq`).catch(() => null)
                        member.guild.members.ban(member.id)
                    } else {
                        if (client.modchannel.get().modchannel) {
                            staffchan.send(`** WARNING: ** ${member.user.tag} - Recently Joined and has been added to the global ban database. \n \n They were banned for: \`\`\` ${globalBanned.reason}\`\`\` \n \n Global Bans have been disabled on this server.`)
                        }
                        else {
                            if (client.logchannel.get().logchannel) {
                                logchannel.send(`** WARNING: ** ${member.user.tag} - Recently Joined and has been added to the global ban database. \n \n They were banned for: \`\`\` ${globalBanned.reason}\`\`\` `)
                            }
                        }
                        member.send(`**WARNING: Your username has been added to our global ban database, appeal via email to: https://discord.gg/ZqUSVpDcRq **`).catch(() => null)
                    }
                }
            }
            client.getAppealed = bansql.prepare("SELECT * FROM bans WHERE user = ?  AND approved = 'GLOBAL' AND appealed = 'Yes'");
            globalAppealed = client.getAppealed.get(member.user.id);
            if (globalAppealed) {

                if (client.logchannel.get().logchannel) {
                    logchannel.send(`${member.user.tag} - Recently Joined member has been added to the global ban list, but has appealed their ban successfully \n \n They were banned for: \`\`\` ${globalAppealed.reason}\`\`\` `)
                }
                member.send(`**WARNING:** Your account has been previously banned and you have a successful appeal, this will be sent to new servers for the next 60 days`).catch(() => null)
            }
            if (client.logchannel.get().logchannel) {
                const logchannel = member.guild.channels.cache.get(client.logchannel.get().logchannel);
                const guild = member.guild;
                const embed = new EmbedBuilder();
                embed.setColor("#00ff00")
                embed.setTitle('**MODERATION LOG: NEW MEMBER JOINED**');
                embed.addFields(
                    { name: 'Username::', value: `${member.user.username}`, inline: true },
                    { name: 'Local Bans', value: `${localBanCount.length}`, inline: false },
                    { name: 'Global Bans', value: `${globalBanCount.length}`, inline: false },
                    { name: 'Kick(s)', value: `${KickCount.length}`, inline: false },
                    { name: 'Timeouts(s)', value: `${timeoutCount.length}`, inline: false },
                    { name: 'Warnings(s)', value: `${warningCount.length}`, inline: false },
                    { name: 'Trust level(s)', value: `${trustlevel}`, inline: false },
                    { name: 'Calculation(s)', value: `${reason}`, inline: false },
                )
                logchannel.send({ embeds: [embed] });
            }
        }
    } catch (error) {
        console.log(error);
    }
}