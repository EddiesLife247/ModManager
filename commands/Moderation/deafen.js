const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const SQLite = require("better-sqlite3");
const bansql = new SQLite(`./databases/bans.sqlite`);
module.exports = {
  name: "deafen", //the command name for the Slash Command
  category: "Moderation",
  usage: "deafen [member]",
  aliases: [],
  description: "Defeans a member from the server", //the command description for Slash Command Overview
  cooldown: 15,
  memberpermissions: ["MANAGE_MEMBERS"],
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


        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase());
        let reason = args.slice(1).join(" ");
        if (!reason) reason = "No Reason Provided"


        try {
          member.voice.setDeaf(true, reason);
          banneduserId = member.id;
          bannedguildId = message.guild.id;
          bannedtype = 'WARNING';
          bannedlength = 15;
          bannedreason = '[AUTO] User Was Deafened';
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
          message.channel.send("Success ✅ : Member Deafened")
        }

        catch (error) {
          console.log(error)
          message.channel.send("Oops! An unknown error occured. Please try again later.")
        }
      } catch (err) {
        console.log(err);

      }
    }
  }
};