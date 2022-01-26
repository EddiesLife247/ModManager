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
module.exports = async (client, member) => {
  const guild = member.guild;
  if (guild.me.permissions.has("VIEW_AUDIT_LOG")) {
    //if (member.me.permissions.has("VIEW_AUDIT_LOG")) {
    client.settings.ensure(member.guild.id, {
      prefix: config.prefix,
      defaultvolume: 50,
      defaultautoplay: false,
      defaultfilters: [`bassboost6`, `clear`],
      djroles: [],
      botchannel: [],
      logxhannel: [],
    })
    client.addBan = bansql.prepare("INSERT INTO bans (id, user, guild, reason, approved, appealed, date, length) VALUES (@id, @user, @guild, @reason, @approved, 'No', datetime('now'), 30);");

    // Load the guild's settings
    if (member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel"))) {
      const fetchedLogs = await member.guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_KICK',
      });
      //console.log(fetchedLogs);
      //return;
      const kickLog = fetchedLogs.entries.first();
      if (!kickLog) {
        var execute = "UNKNOWN";
        kickReason = "User Left";
      } else {
        if (Date.now() - kickLog.createdTimestamp < 5000) {

          const { executor, target } = kickLog;
          if (target.id === member.id) {
            var execute = executor.tag;
            let banid = Math.floor(Math.random() * 9999999999) + 25;
            if (kickLog.reason) {
              kickReason = kickLog.reason;
            } else {
              kickReason = "No Reason Given";
            }

            score = { id: `${member.user.id}-${banid}`, user: member.user.id, guild: member.guild.id, reason: kickReason, approved: 'KICK' };
            //user kicked log to kick logs
            const KickCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'KICK' AND user = ${member.id}  AND guild = ${member.guild.id}`).all();
            console.log(KickCount);
            if (client.settings.get(member.guild.id, "kickban") == "0" || client.settings.get(member.guild.id, "kickban") == null) {
              client.addBan.run(score);
            }
            else if (KickCount.length > client.settings.get(member.guild.id, "kickban")) {
              //member = await member.guild.members.cache.get(member.id);
              member.guild.members.ban(member.id, { reason: `You were kicked ${KickCount.length} times within the last 30 days` });
              let banid = Math.floor(Math.random() * 9999999999) + 25;
              let banReason = "[AUTO] User Exceeded Kick Ban Limit on Guild"
              let banApproved = "LOCAL"
              client.addBan = bansql.prepare("INSERT INTO bans (id, user, guild, reason, approved, appealed, date, length) VALUES (@id, @user, @guild, @reason, @approved, 'No', datetime('now'), 60);");
              score = { id: `${member.id}-${banid}`, user: member.id, guild: member.guild.id, reason: banReason, approved: banApproved };
              client.addBan.run(score);
              return;

            } else {
              client.addBan.run(score);
            }
          }
        }
        else {
          var execute = "UNKNOWN";
        }
      }
      kickReason = "Unknown / Maybe Left?";
      const embed = new Discord.MessageEmbed()
        .setAuthor(`Modlogs`, member.guild.iconURL())
        .setColor("#ff0000")
        .setFooter(member.guild.name, member.guild.iconURL())
        .setTitle("**Moderation** - Member Left/Kicked")
        .addField("**Member**", `${member.user.tag}`, true)
        .addField("**Executor**", `${execute}`, true)
        .addField("**Reason**", `${kickReason}`)
        .setTimestamp();
      if (member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel"))) {
        member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel")).send({ embeds: [embed] });
        client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${member.guild.name} triggered event: GuildMemberRemove Successfully`);
        //client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${message.guild.name} triggered event: GuildMemberRemove Successfully`);
        //console.log(`Found log channel and sent message: ${settings.modLogChannel} in ${member.guild.id}`);
      } else {
        //console.log(`Cannot find channel: ${settings.modLogChannel} in: ${member.guild.name}`);
      }
    }
  }
  //}
};
