const Discord = require('discord.js');
const db = require('quick.db');
const SQLite = require("better-sqlite3");
const bansql = new SQLite(`./databases/bans.sqlite`);
const config = require(`../../botconfig/config.json`);
module.exports = {
  name: "warn", //the command name for the Slash Command
  category: "Moderation",
  usage: "warn [member] [reason]",
  aliases: [],
  description: "Warn's a member on the server", //the command description for Slash Command Overview
  cooldown: 15,
  memberpermissions: ["MANAGE_MEMBERS"],
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
      let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if (!member) return message.reply("Please mention a valid member of this server");

      let reason = args.slice(1).join(' ');
      if (!reason) reason = "(No Reason Provided)";

      member.send(`You have been warned by <${message.author.username}> for this reason: ${reason}`)
        .catch(error => message.channel.send(`Sorry <${message.author}> I couldn't n't warn because of : ${error}`));
      let warnEmbed = new Discord.MessageEmbed()
        .setTitle("**__Warn Report__**")
        .setDescription(`**<@${member.user.id}> has been warned by <@${message.author.id}>**`)
        .addField(`**Reason:**`, `\`${reason}\``)
        .addField(`**Action:**`, `\`Warn\``)
        .addField(`**Moderator:**`, `${message.author}`)
        .addField("**USER HISTORY: **", `http://modmanager.manumission247.co.uk:38455/bans/${member.id}`)
        .setURL(`http://modmanager.manumission247.co.uk:38455/bans/${member.id}`)

      message.channel.send({ embeds: [warnEmbed] })
      banneduserId = member.id;
      bannedguildId = message.guild.id;
      bannedtype = 'WARNING';
      bannedlength = 15;
      bannedreason = reason;
      bannedbanid = Math.floor(Math.random() * 9999999999) + 25;
      client.addBan = bansql.prepare("INSERT INTO bans (id, user, guild, reason, approved, appealed, date, length) VALUES (@id, @user, @guild, @reason, @approved, 'No', datetime('now'), @length);");
      score = { id: `${banneduserId}-${bannedbanid}`, user: banneduserId, guild: bannedguildId, reason: bannedreason, approved: bannedtype, length: bannedlength };
      try {
        //message.channel.send(`Please do not post links on this server! <@${message.author.id}>. Only YouTube links are permitted with the Music Command at this time`);
        const KickCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'WARNING' AND user = ${member.id} AND guild = ${message.guild.id}`).all();
        if (client.settings.get(member.guild.id, "warnkick") == "0" || client.settings.get(member.guild.id, "warnkick") == "") {
          client.addBan.run(score);
        }
        else if (KickCount.length >= client.settings.get(member.guild.id, "warnkick")) {
          message.timeout(timedout * 60 * 1000, `You were Warned ${KickCount.length} times within the last 15 days`);
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
      //message.reply("user has been warned!");

    }
  } catch (e) {
    const { logMessage } = require(`../../handlers/newfunctions`);
    logMessage(client, `error`, message.guild, `Error with WARN command: ${e.message} | \`\`\` ${e.stack} \`\`\``);
  }
  }
};