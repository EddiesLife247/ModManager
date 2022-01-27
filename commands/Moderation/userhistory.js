const Discord = require('discord.js');
const db = require('quick.db');
const SQLite = require("better-sqlite3");
const bansql = new SQLite(`./databases/bans.sqlite`);
module.exports = {
    name: "userhistory", //the command name for the Slash Command
    category: "Moderation",
    usage: "userhistory [member]",
    aliases: [],
    description: "Views the Users Discord History", //the command description for Slash Command Overview
    cooldown: 15,
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    run: async (client, message, args) => {
        client.features.ensure(guild.id, {
            music: true,
            logs: true,
            reactionroles: true,
            moderation: true,
            fun: true,
            youtube: false,
            support: true,
            points: true,
        });
        if (client.features.get(message.guild.id, "moderation") == false) {
            return;
        } else {
            try {

            let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            const localBanCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'LOCAL' AND user = ${member.user.id}`).all();
            console.log(localBanCount.length);
            const globalBanCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'GLOBAL' AND user = ${member.user.id}`).all();
            const KickCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'KICK' AND user = ${member.user.id}`).all();
            const warningCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'WARNING' AND user = ${member.user.id}`).all();
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
            console.log(member.user.avatar);
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
            //console.log(`${trustlevel} out of a possible 55 points.`);
            //console.log('----------');
            ///console.log(reason);
            const embed = new Discord.MessageEmbed()
                .setAuthor(`Modlogs`, member.guild.iconURL())
                .setColor("#00ff00")
                .setFooter(member.guild.name, member.guild.iconURL())
                .setTitle("**Moderation** - User History Data")
                .addField("**Member**", `${member.user.tag}`)
                .addField("**Local Ban(s)**", `${localBanCount.length}`, true)
                .addField("**Global Ban(s)**", `${globalBanCount.length}`, true)
                .addField("**Kicked From Server(s)**", `${KickCount.length}`, true)
                .addField("**WARNINGS**", `${warningCount.length}`, true)
                .addField("**User's Trust level /50**", `${trustlevel}`, true)
                .addField("**How the score was calculated.**", `${reason}`)
                .addField("**USER HISTORY: **", `http://modmanager.manumission247.co.uk:38455/bans/${member.user.id}`)

                .setURL(`http://modmanager.manumission247.co.uk:38455/bans/${member.user.id}`)
                .setTimestamp();
            message.channel.send({ embeds: [embed] })
            //message.reply("user has been warned!");
        }
        catch (err) {
            console.log(err);
        }
        }
    }
};