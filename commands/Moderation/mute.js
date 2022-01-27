const { Discord } = require('discord.js');
const db = require('quick.db');
const SQLite = require("better-sqlite3");
const bansql = new SQLite(`./databases/bans.sqlite`);

module.exports = {

    name: "mute", //the command name for the Slash Command
    category: "Moderation",
    usage: "mute [member] [reason]",
    aliases: [],
    memberpermissions: ["MANAGE_MEMBERS"],
    description: "Mutes a member from the server (timeout for 1 hour)", //the command description for Slash Command Overview
    cooldown: 15,
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    run: async (client, message, args) => {
        try {
        client.features.ensure(message.guild.id, {
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
            client.settings.ensure(message.guild.id, {
                prefix: config.prefix,
                defaultvolume: 50,
                defaultautoplay: false,
                defaultfilters: [`bassboost6`, `clear`],
                djroles: [],
                botchannel: [],
                partnerchannel: [],
                logchannel: [],
                topicmodlogs: true,
                randomtopic: [],
                qotdchannel: [],
                levelupchan: [],
                swearfilter: false,
                urlfilter: false,
                NSFWurlfilter: false,
                invitefilter: false,
                warnkick: "",
                kickban: "",
                timeoutLength: "",
                cooldown: null,
            })
            if (client.settings.get(message.guild.id, "timeoutLength") == "") {
                var timedout = 60;
            } else {
                var timedout = client.settings.get(message.guild.id, "timeoutLength");
            }
            try {
                if (!args[0]) return message.channel.send("**Please Enter A User To Be Muted!**");

                var mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
                if (!mutee) return message.channel.send("**Please Enter A Valid User To Be Muted!**");

                if (mutee === message.member) return message.channel.send("**You Cannot Mute Yourself!**")
                if (mutee.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) return message.channel.send('**Cannot Mute This User!**')

                let reason = args.slice(1).join(" ");
                if (mutee.user.bot) return message.channel.send("**Cannot Mute Bots!**");

                try {
                    mutee.timeout(timedout * 60 * 1000, `${reason}`)
                    message.reply("User has been timedout for 1 Hour - Added to Punishment Database for 15 days.");
                } catch {
                    mutee.roles.set([muterole.id])
                }
                if (reason) {
                    const sembed = new Discord.RichEmbed()
                        .setColor("GREEN")
                        .setAuthor(message.guild.name, message.guild.iconURL())
                        .setDescription(`${mutee.user.username} was successfully muted for ${reason}`)
                    message.channel.send(sembed);
                } else {
                    const sembed2 = new Discord.RichEmbed()
                        .setColor("GREEN")
                        .setDescription(`${mutee.user.username} was successfully muted`)
                    message.channel.send(sembed2);
                }
                banneduserId = member.id;
                bannedguildId = message.guild.id;
                bannedtype = 'WARNING';
                bannedlength = 15;
                bannedreason = 'User Was Muted/Timedout';
                bannedbanid = Math.floor(Math.random() * 9999999999) + 25;
                client.addBan = bansql.prepare("INSERT INTO bans (id, user, guild, reason, approved, appealed, date, length) VALUES (@id, @user, @guild, @reason, @approved, 'No', datetime('now'), @length);");
                score = { id: `${banneduserId}-${bannedbanid}`, user: banneduserId, guild: bannedguildId, reason: bannedreason, approved: bannedtype, length: bannedlength };
                try {
                    const KickCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'WARNING' AND user = ${member.id} AND guild = ${message.guild.id}`).all();
                    if (client.settings.get(member.guild.id, "warnkick") == "0" || client.settings.get(member.guild.id, "warnkick") == null) {
                        client.addBan.run(score);
                    }
                    else if (KickCount.length >= client.settings.get(member.guild.id, "warnkick")) {
                        message.author.kick(`You were Warned ${KickCount.length} times within the last 15 days`);
                        message.delete();
                        return;

                    } else {
                        await client.addBan.run(score);
                        message.delete();
                        return;
                    }

                } catch (err) {
                    console.log(err);
                    message.delete();
                }

                let channel = db.fetch(`modlog_${message.guild.id}`)
                if (!channel) return;

                let embed = new Discord.RichEmbed()
                    .setColor('RED')
                    .setThumbnail(mutee.user.displayAvatarURL({ dynamic: true }))
                    .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
                    .addField("**Moderation**", "mute")
                    .addField("**Mutee**", mutee.user.username)
                    .addField("**Moderator**", message.author.username)
                    .addField("**Reason**", `${reason || "**No Reason**"}`)
                    .addField("**Date**", message.createdAt.toLocaleString())
                    .setFooter(message.member.displayName, message.author.displayAvatarURL())
                    .setTimestamp()

                var sChannel = message.guild.channels.cache.get(channel)
                if (!sChannel) return;
                sChannel.send(embed)
            } catch {
                return;
            }
        }
    } catch (e) {
        const { logMessage } = require(`../../handlers/newfunctions`);
        logMessage(client, `error`, message.guild, `Error with MUTE command: ${e.message} | ${e.stack}`);
    }
    }


    };