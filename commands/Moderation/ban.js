const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "ban", //the command name for the Slash Command
    category: "Moderation",
    usage: "ban [member] [reason]",
    aliases: [],
    description: "Bans a member from the server", //the command description for Slash Command Overview
    cooldown: 15,
    memberpermissions: ["MANAGE_MEMBERS"],
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    run: async (client, message, args) => {
        try {
            /*if (!message.member.permissions.has([Permissions.FLAGS.KICK_MEMBERS, Permissions.FLAGS.BAN_MEMBERS]) && !ownerID .includes(message.author.id)) return message.channel.send("**You Dont Have The Permissions To Ban Users! - [BAN_MEMBERS]**");
            if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send("**I Dont Have The Permissions To Ban Users! - [BAN_MEMBERS]**");
            if (!args[0]) return message.channel.send("**Please Provide A User To Ban!**")
            */
            let banMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
            if (!banMember) return message.channel.send("**User Is Not In The Guild**");
            if (banMember === message.member) return message.channel.send("**You Cannot Ban Yourself**")

            var reason = args.slice(1).join(" ");

            if (!banMember.bannable) return message.channel.send("**Cant Kick That User**")
            try {
                banMember.send(`**Hello, You Have Been Banned From ${message.guild.name} for - ${reason || "No Reason"}**`).catch(() => null)
                message.guild.members.ban(banMember)
            } catch {
                message.guild.members.ban(banMember)
            }
            if (reason) {
                var sembed = new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`**${banMember.user.username}** has been banned for ${reason}`)
                message.channel.send({ embeds: [sembed] })
            } else {
                var sembed2 = new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`**${banMember.user.username}** has been banned`)
                message.channel.send({ embeds: [sembed2] })
            }
            let channel = db.fetch(`modlog_${message.guild.id}`)
            if (channel == null) return;

            if (!channel) return;

            const embed = new Discord.MessageEmbed()
                .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
                .setColor("#ff0000")
                .setThumbnail(banMember.user.displayAvatarURL({ dynamic: true }))
                .setFooter(message.guild.name, message.guild.iconURL())
                .addField("**Moderation**", "ban")
                .addField("**Banned**", banMember.user.username)
                .addField("**ID**", `${banMember.id}`)
                .addField("**Banned By**", message.author.username)
                .addField("**Reason**", `${reason || "**No Reason**"}`)
                .addField("**Date**", message.createdAt.toLocaleString())
                .setTimestamp();

            var sChannel = message.guild.channels.cache.get(channel)
            if (!sChannel) return;
            message.channel.send({ embeds: [embed] })
        } catch (e) {
            return message.channel.send(`**${e.message}**`)
        }
    }
}