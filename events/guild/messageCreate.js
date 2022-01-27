//Import Modules
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg, msgCooldown } = require(`../../handlers/functions`);
const { logMessage, refreshPunishDB } = require(`../../handlers/newfunctions`);
const Discord = require(`discord.js`);
const SQLite = require("better-sqlite3");
const joke = require("../../slashCommands/Fun/joke");
const sql = new SQLite(`./databases/scores.sqlite`);
const bansql = new SQLite(`./databases/bans.sqlite`);
const botsql = new SQLite(`./databases/bot.sqlite`);
var Filter = require('bad-words'),
  filter = new Filter();
module.exports = async (client, message) => {
  if (!message.guild || !message.channel || message.author.bot) return;
  if (message.channel.partial) await message.channel.fetch();
  if (message.partial) await message.fetch();
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
  const prefixMention = new RegExp(`^<@!?${client.user.id}> ?$`);
  if (message.content.match(prefixMention)) {
    return message.reply(`My prefix on this guild is \`${client.settings.get(message.guild.id, "prefix")}\``);
  }
  const forbidenWords = ['fuck', 'shit', 'bollocks', 'twat', 'nigger', 'bastard', 'cunt', '.xxx', 'XX'];
  if (message.guild.me.permissions.has("MANAGE_MESSAGES")) {
    //console.log("I have permissions!");
    if (client.settings.get(message.guild.id, "cooldown")) {
      //console.log("cooldown set!");
      const cooldown = client.settings.get(message.guild.id, "cooldown");
      if (msgCooldown(message, cooldown)) {
        //WARNING GOES HERE
        let banneduserId = message.author.id;
        let bannedguildId = message.guild.id;
        let bannedtype = 'WARNING';
        let bannedlength = 2;
        let bannedreason = `[AUTO] User spammed in a channel meeting guild message cooldown requirements ${cooldown} seconds`;
        let bannedbanid = Math.floor(Math.random() * 9999999999) + 25;
        client.addBan = bansql.prepare("INSERT INTO bans (id, user, guild, reason, approved, appealed, date, length) VALUES (@id, @user, @guild, @reason, @approved, 'No', datetime('now'), @length);");
        score5 = { id: `${banneduserId}-${bannedbanid} `, user: banneduserId, guild: bannedguildId, reason: bannedreason, approved: bannedtype, length: bannedlength };
        const KickCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'WARNING' AND user = ${message.author.id} AND guild = ${message.guild.id} `).all();
        member = await message.guild.members.cache.get(message.author.id);
        if (KickCount.length == 0) {
          client.addBan.run(score5);
          message.delete();
          message.channel.send({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle(replacemsg(settings.messages.msgcooldown, {
                timeLeft: msgCooldown(message, cooldown)
              }))
              .addField(`WARNINGS: `, `${KickCount.length + 1} /  ${client.settings.get(message.guild.id, "warnkick")}`)
            ]
          }).then(msg => {
            setTimeout(function () { // Setup a timer
              msg.delete(); // Deletes the ticket message
            }, 8000); // 5 seconds in milliseconds
          });
          return;
        }
        else if (client.settings.get(message.guild.id, "warnkick") == 0 || client.settings.get(message.guild.id, "warnkick") == null) {
          client.addBan.run(score5);
          message.delete();
          message.channel.send({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle(replacemsg(settings.messages.msgcooldown, {
                timeLeft: msgCooldown(message, cooldown)
              }))
              .addField(`WARNINGS: `, `${KickCount.length + 1} /  ${client.settings.get(message.guild.id, "warnkick")}`)
            ]
          }).then(msg => {
            setTimeout(function () { // Setup a timer
              msg.delete(); // Deletes the ticket message
            }, 8000); // 5 seconds in milliseconds
          });
          return;
        }
        else if (KickCount.length >= client.settings.get(message.guild.id, "warnkick")) {
          member.timeout(60 * 60 * 1000, `You were Warned ${KickCount.length} times within the last 15 days, you now have a 1 hour timeout`)
          message.delete();
          return;

        } else {
          await client.addBan.run(score5);
          message.delete();
          message.channel.send({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle(replacemsg(settings.messages.msgcooldown, {
                timeLeft: msgCooldown(message, cooldown)
              }))
              .addField(`WARNINGS: `, `${KickCount.length + 1} /  ${client.settings.get(message.guild.id, "warnkick")}`)
            ]
          }).then(msg => {
            setTimeout(function () { // Setup a timer
              msg.delete(); // Deletes the ticket message
            }, 8000); // 5 seconds in milliseconds
          });
          return;
        }


      }
    }
    if (client.settings.get(message.guild.id, "swearfilter") == true) {
      //console.log(message.content);
      if (message.channel.nsfw == false) {
        try {
          var customFilter = new Filter({ placeHolder: 'XX' });
          if (message.content == null) {
            // NO NEED TO CHECK ITS NOTHING!
          } else {
            const msg = customFilter.clean(message.content);
            for (var i = 0; i < forbidenWords.length; i++) {
              if (msg.includes(forbidenWords[i])) {
                try {
                  let banneduserId = message.author.id;
                  let bannedguildId = message.guild.id;
                  let bannedtype = 'WARNING';
                  let bannedlength = 15;
                  let bannedreason = '[AUTO] User warned for swearing';
                  let bannedbanid = Math.floor(Math.random() * 9999999999) + 25;
                  client.addBan = bansql.prepare("INSERT INTO bans (id, user, guild, reason, approved, appealed, date, length) VALUES (@id, @user, @guild, @reason, @approved, 'No', datetime('now'), @length);");
                  score2 = { id: `${banneduserId}-${bannedbanid}`, user: banneduserId, guild: bannedguildId, reason: bannedreason, approved: bannedtype, length: bannedlength };
                  const KickCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'WARNING' AND user = ${message.author.id} AND guild = ${message.guild.id}`).all();
                  //console.log(KickCount.length);
                  member = await message.guild.members.cache.get(message.author.id);
                  //console.log(member);
                  if (KickCount.length == 0) {
                    client.addBan.run(score2);
                    message.channel.send(`Please do not swear on this server! <@${message.author.id}> WARNING: ${KickCount.length + 1} /  ${client.settings.get(message.guild.id, "warnkick")}`);
                    message.delete();
                    //console.log("Kick is set to null add data.")
                    return;
                  }
                  else if (client.settings.get(message.guild.id, "warnkick") == 0 || client.settings.get(message.guild.id, "warnkick") == null) {
                    client.addBan.run(score2);
                    message.channel.send(`Please do not swear on this server! <@${message.author.id}> WARNING: ${KickCount.length + 1} /  ${client.settings.get(message.guild.id, "warnkick")}`);
                    message.delete();
                    //console.log("Kick is set to null add data.")
                    return;
                  }
                  else if (KickCount.length >= client.settings.get(message.guild.id, "warnkick")) {
                    member.timeout(timedout * 60 * 1000, `You were Warned ${KickCount.length} times within the last 15 days, you now have a 1 hour timeout`)
                    message.channel.send(`Please do not swear on this server! <@${message.author.id}> WARNING: ${KickCount.length + 1} /  ${client.settings.get(message.guild.id, "warnkick")}`);
                    message.delete();
                    // console.log("meets kick req");
                    return;

                  } else {
                    //console.log("Adding Data");
                    await client.addBan.run(score2);
                    message.channel.send(`Please do not swear on this server! <@${message.author.id}> WARNING: ${KickCount.length + 1} /  ${client.settings.get(message.guild.id, "warnkick")}`);
                    message.delete();
                    return;
                  }

                } catch (err) {
                  message.channel.send(`Please do not swear on this server! <@${message.author.id}> WARNING: ${KickCount.length + 1} /  ${client.settings.get(message.guild.id, "warnkick")}`);
                  console.log(err);
                  logMessage(client, "error", message.guild, `Error at line 190: ${err} (messageCreate)`);
                  message.delete();
                  return;
                }
              }
            }
            // CODE FOR CONTENT FILTER

          }
        } catch (err) {
          //do nothing
        }
      }
    }
    if (client.settings.get(message.guild.id, "invitefilter") == true) {

      const bannedWords = [`discord.gg`, `.gg/`, `.gg /`, `. gg /`, `. gg/`, `discord .gg /`, `discord.gg /`, `discord .gg/`, `discord .gg`, `discord . gg`, `discord. gg`, `discord gg`, `discordgg`, `discord gg /`]
      try {

        if (bannedWords.some(word => message.content.toLowerCase().includes(word))) {
          if (!client.settings.get(message.guild.id, `partnerchannel`).includes(message.channel.id) && !message.member.permissions.has("ADMINISTRATOR")) {
            try {
              await message.channel.send(`You cannot send invites to other Discord servers`);
              let banneduserId = message.author.id;
              let bannedguildId = message.guild.id;
              let bannedtype = 'WARNING';
              let bannedlength = 15;
              let bannedreason = '[AUTO] User warned for sharing discord invite links';
              let bannedbanid = Math.floor(Math.random() * 9999999999) + 25;
              client.addBan = bansql.prepare("INSERT INTO bans (id, user, guild, reason, approved, appealed, date, length) VALUES (@id, @user, @guild, @reason, @approved, 'No', datetime('now'), @length);");
              score3 = { id: `${banneduserId}-${bannedbanid}`, user: banneduserId, guild: bannedguildId, reason: bannedreason, approved: bannedtype, length: bannedlength };
              const KickCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'WARNING' AND user = ${message.author.id} AND guild = ${message.guild.id}`).all();
              member = await message.guild.members.cache.get(message.author.id);
              if (KickCount.length == 0) {
                client.addBan.run(score3);
                message.channel.send(`Please do not swear on this server! <@${message.author.id}>`);
                message.delete();
                // console.log("Kick is set to null add data.")
                return;
              }
              else if (client.settings.get(message.guild.id, "warnkick") == 0 || client.settings.get(message.guild.id, "warnkick") == null) {
                client.addBan.run(score3);
                message.channel.send(`Please do not send invites on this server! <@${message.author.id}> WARNING: ${KickCount.length + 1} /  ${client.settings.get(message.guild.id, "warnkick")}`);
                message.delete();
                // console.log("Kick is set to null add data.")
                return;
              }
              else if (KickCount.length >= client.settings.get(message.guild.id, "warnkick")) {
                member.timeout(timedout * 60 * 1000, `You were Warned ${KickCount.length} times within the last 15 days, you now have a 1 hour timeout`)
                message.channel.send(`Please do not send invites on this server! <@${message.author.id}> WARNING: ${KickCount.length + 1} /  ${client.settings.get(message.guild.id, "warnkick")}`);
                message.delete();
                return;

              } else {
                await client.addBan.run(score3);
                message.channel.send(`Please do not send invites on this server! <@${message.author.id}> WARNING: ${KickCount.length + 1} /  ${client.settings.get(message.guild.id, "warnkick")}`);
                message.delete();
                return;
              }

            } catch (err) {
              message.channel.send(`Please do not send invites on this server! <@${message.author.id}> WARNING: ${KickCount.length + 1} /  ${client.settings.get(message.guild.id, "warnkick")}`);
              console.log(err);
              logMessage(client, "error", message.guild, `Error at line 252: ${error} (messageCreate)`);
              message.delete();
            }
          }
          //if (message.author.id === message.guild.ownerID) return console.log("owner override");


          //await message.delete();


          return;
        }
      } catch (e) {
        logMessage(client, "error", message.guild, `Error at line 265: ${e} (messageCreate)`);
        console.log(e);
      }
    }
    const urlDeny = ['http', 'https', '.com', 'www', '.co.uk', '.uk', '.xl'];
    if (client.settings.get(message.guild.id, "urlfilter") == true) {
      if (message.member.permissions.has("EMBED_LINKS")) {
        // DO nothing! - They have permission!
      }
      else if (message.content.includes(`play`)) {
        // Do nothing for Music command.
      }
      else if (message.content.includes(`playskip`)) {
        // Do nothing for Music command.
      }
      else if (message.content.includes(`playtop`)) {
        // Do nothing for Music command.
      }
      else {
        for (var i = 0; i < urlDeny.length; i++) {
          if (message.content.includes(urlDeny[i])) {
            try {
              let banneduserId = message.author.id;
              let bannedguildId = message.guild.id;
              let bannedtype = 'WARNING';
              let bannedlength = 15;
              let bannedreason = '[AUTO] User warned for sending Links';
              let bannedbanid = Math.floor(Math.random() * 9999999999) + 25;
              client.addBan = bansql.prepare("INSERT INTO bans (id, user, guild, reason, approved, appealed, date, length) VALUES (@id, @user, @guild, @reason, @approved, 'No', datetime('now'), @length);");
              score4 = { id: `${banneduserId}-${bannedbanid}`, user: banneduserId, guild: bannedguildId, reason: bannedreason, approved: bannedtype, length: bannedlength };
              const KickCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'WARNING' AND user = ${message.author.id} AND guild = ${message.guild.id}`).all();
              member = await message.guild.members.cache.get(message.author.id);
              if (KickCount.length == 0) {
                client.addBan.run(score4);
                message.channel.send(`Please do not send links on this server! <@${message.author.id}>  WARNING: ${KickCount.length + 1} /  ${client.settings.get(message.guild.id, "warnkick")}`);
                message.delete();
                //console.log("Kick is set to null add data.")
                return;
              }
              else if (client.settings.get(message.guild.id, "warnkick") == 0 || client.settings.get(message.guild.id, "warnkick") == null) {
                client.addBan.run(score4);
                message.channel.send(`Please do not send links on this server! <@${message.author.id}> WARNING: ${KickCount.length + 1} /  ${client.settings.get(message.guild.id, "warnkick")}`);
                message.delete();
                //console.log("Kick is set to null add data.")
                return;
              }
              else if (KickCount.length >= client.settings.get(message.guild.id, "warnkick")) {
                member.timeout(timedout * 60 * 1000, `You were Warned ${KickCount.length} times within the last 15 days, you now have a 1 hour timeout`)
                message.channel.send(`Please do not send links on this server! <@${message.author.id}>  WARNING: ${KickCount.length + 1} /  ${client.settings.get(message.guild.id, "warnkick")}`);
                message.delete();
                return;

              } else {
                await client.addBan.run(score4);
                message.channel.send(`Please do not send links on this server! <@${message.author.id}> WARNING: ${KickCount.length + 1} /  ${client.settings.get(message.guild.id, "warnkick")}`);
                message.delete();
                return;
              }

            } catch (err) {
              message.channel.send(`Please do not send links on this server! <@${message.author.id}> WARNING: ${KickCount.length + 1} /  ${client.settings.get(message.guild.id, "warnkick")}`);
              console.log(err);
              logMessage(client, "error", message.guild, `Error at line 328: ${err} (messageCreate)`);
              message.delete();
              return;
            }
            //Cancel Message and don't count to points.
          }
        }
      }
    }
    const urlDenyXXX = ['sex', 'porn', 'fuck', 'xnxx', 'xhamster', 'fuq', 'jezebel', 'nonktube', 'bbw', 'xvideos', 'adult', 'xdownloader'];
    if (client.settings.get(message.guild.id, "NSFWurlfilter") == true) {
      if (message.channel.nsfw == false) {
        for (var i = 0; i < urlDenyXXX.length; i++) {
          if (message.content.includes(urlDenyXXX[i])) {
            try {
              let banneduserId = message.author.id;
              let bannedguildId = message.guild.id;
              let bannedtype = 'WARNING';
              let bannedlength = 15;
              let bannedreason = '[AUTO] User warned for sending NSFW Links';
              let bannedbanid = Math.floor(Math.random() * 9999999999) + 25;
              client.addBan = bansql.prepare("INSERT INTO bans (id, user, guild, reason, approved, appealed, date, length) VALUES (@id, @user, @guild, @reason, @approved, 'No', datetime('now'), @length);");
              score6 = { id: `${banneduserId}-${bannedbanid}`, user: banneduserId, guild: bannedguildId, reason: bannedreason, approved: bannedtype, length: bannedlength };
              const KickCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'WARNING' AND user = ${message.author.id} AND guild = ${message.guild.id}`).all();
              member = await message.guild.members.cache.get(message.author.id);
              if (KickCount.length == 0) {
                client.addBan.run(score6);
                message.channel.send(`Please do not send NSFW links on this server! outside of NSFW channels <@${message.author.id}>  WARNING: ${KickCount.length + 1} /  ${client.settings.get(message.guild.id, "warnkick")}`);
                message.delete();
                //console.log("Kick is set to null add data.")
                return;
              }
              else if (client.settings.get(message.guild.id, "warnkick") == 0 || client.settings.get(message.guild.id, "warnkick") == null) {
                client.addBan.run(score6);
                message.channel.send(`Please do not send NSFW links on this server! outside of NSFW channels <@${message.author.id}> WARNING: ${KickCount.length + 1} /  ${client.settings.get(message.guild.id, "warnkick")}`);
                message.delete();
                //console.log("Kick is set to null add data.")
                return;
              }
              else if (KickCount.length >= client.settings.get(message.guild.id, "warnkick")) {
                member.timeout(timedout * 60 * 1000, `You were Warned ${KickCount.length} times within the last 15 days, you now have a 1 hour timeout`)
                message.channel.send(`Please do not send NSFW links on this server! outside of NSFW channels <@${message.author.id}>  WARNING: ${KickCount.length + 1} /  ${client.settings.get(message.guild.id, "warnkick")}`);
                message.delete();
                return;

              } else {
                await client.addBan.run(score6);
                message.channel.send(`Please do not send NSFW links on this server! outside of NSFW channels <@${message.author.id}> WARNING: ${KickCount.length + 1} /  ${client.settings.get(message.guild.id, "warnkick")}`);
                message.delete();
                return;
              }

            } catch (err) {
              message.channel.send(`Please do not send NSFW links on this server! outside of NSFW channels <@${message.author.id}> WARNING: ${KickCount.length + 1} /  ${client.settings.get(message.guild.id, "warnkick")}`);
              console.log(err);
              logMessage(client, "error", message.guild, `Error at line 383: ${err} (messageCreate)`);
              message.delete();
              return;
            }
            //Cancel Message and don't count to points.
          }
        }
      }
    }
  }
  client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
  client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");

  // POINTS CODE
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
  if (client.features.get(message.guild.id, "points") == false) {

  } else {
    let score = client.getScore.get(message.author.id, message.guild.id);
    if (!score) {
      score = {
        id: `${message.guild.id}-${message.author.id}`,
        user: message.author.id,
        guild: message.guild.id,
        points: 0,
        level: 1
      }
    }
    score.points++;
    //console.log(score.points);
    // Calculate the current level through MATH OMG HALP.
    let difficulty = 0.3;
    let serverdifficulty = client.settings.get(message.guild.id, `serverdifficulty`)
    if (serverdifficulty == "Hard") {
      difficulty = 0.1;
    }
    else if (serverdifficulty == "Medium" || serverdifficulty == "") {
      difficulty = 0.3;
    }
    else if (serverdifficulty == "Easy") {
      difficulty = 0.6;
    }

    const curLevel = Math.floor(difficulty * Math.sqrt(score.points));
    let levelupchan = client.settings.get(message.guild.id, `levelupchan`)
    //console.log(levelupchan);
    // Check if the user has leveled up, and let them know if they have:
    if (score.level < curLevel) {
      // Level up!
      score.level++;

      if (!client.settings.get(message.guild.id, `levelupchan`).length === 0) {
        client.guilds.cache.get(message.guild.id).channels.cache.get(client.settings.get(message.guild.id, `levelupchan`)).send(`${message.author.tag} has leveled up to level **${curLevel}**! Ain't that dandy?`)
      }
    }
    client.setScore.run(score);
  }
  // ADMINISTRATOR COMMANDS

  if (message.guild.id == "787871047139328000") {
    if (message.channel.id == "901905815810760764") {
      const banargs = message.content.split(' ');
      //console.log(banargs)
      //console.log(banargs[0]);
      if (banargs[0] == "?@features") {
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
        client.features.set(banargs[2], banargs[4], banargs[3])
      }
      if (banargs[0] == "?@banlist") {
        if (banargs[1] == "add") {
          banneduserId = banargs[2];
          bannedguildId = banargs[3];
          bannedtype = banargs[4];
          bannedlength = banargs[5];
          banneduserId = banargs[2];
          bannedreason = banargs.slice(6).join(' ');
          bannedbanid = Math.floor(Math.random() * 9999999999) + 25;
          client.addBan = bansql.prepare("INSERT INTO bans (id, user, guild, reason, approved, appealed, date, length) VALUES (@id, @user, @guild, @reason, @approved, 'No', datetime('now'), @length);");
          score = { id: `${banneduserId}-${bannedbanid}`, user: banneduserId, guild: bannedguildId, reason: bannedreason, approved: bannedtype, length: bannedlength };
          client.addBan.run(score);
          message.reply(`User : ${banneduserId} has now been banned with type: ${bannedtype} for ${bannedlength} days`);
          client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`<@${message.author.id}> has added a ${bannedtype} ban on user: <@${banneduserId}>`);

        } else if (banargs[1] == "edit") {
          if (banargs[3] == 'length') {
            bansql.prepare(`UPDATE bans SET length = '${banargs[4]}' WHERE id = '${banargs[2]}'`).run();
            message.reply(`BAN ID: ${banargs[2]} Length was changed to: ${banargs[4]}`);
          } else if (banargs[3] == 'type') {
            bansql.prepare(`UPDATE bans SET approved = '${banargs[4]}' WHERE id = '${banargs[2]}'`).run();
            message.reply(`BAN ID: ${banargs[2]} type was changed to: ${banargs[4]}`);
          } else if (banargs[3] == 'reason') {
            bannedreason = banargs.slice(4).join(' ');
            bansql.prepare(`UPDATE bans SET reason = '${bannedreason}' WHERE id = '${banargs[2]}'`).run();
            message.reply(`BAN ID: ${banargs[2]} reason was changed to: \`\`\`${bannedreason}\`\`\``);
          }
          return;
        } else if (banargs[1] == "guild") {
          const top10 = bansql.prepare(`SELECT * FROM bans WHERE guild = ${banargs[2]}`).all();
          const embed = new Discord.MessageEmbed()
            .setAuthor(`GLOBAL BAN LIST`, message.channel.guild.iconURL())
            .setTitle(`${banargs[2]} PUNISHMENTS`)
            .setColor("#ff33ff")
            .setFooter(message.channel.guild.name, message.channel.guild.iconURL())
          for (const data of top10) {
            let guildName = client.guilds.cache.get(data.guild).name;
            embed.addField("**User**", `<@${data.user}>`, true)
            embed.addField("**Guild**", `${guildName}`, true)
            embed.addField("**Reason**", `${data.reason}`, true)
            embed.addField("**DATE**", `${data.date}`, true)
            embed.addField("**Ban Id**", `${data.id}`, true)
            embed.addField("**Type**", `${data.approved}`, true)
            embed.addField("**Length**", `${data.length}`, true)
            embed.addField("\u200B", "\u200B");
          }
          message.channel.send({ embeds: [embed] });
          return;
        } else if (banargs[1] == "user") {
          const top10 = bansql.prepare(`SELECT * FROM bans WHERE user = ${banargs[2]}`).all();
          const embed = new Discord.MessageEmbed()
            .setAuthor(`GLOBAL BAN LIST`, message.channel.guild.iconURL())
            .setTitle(`${banargs[2]} PUNISHMENTS`)
            .setColor("#ff33ff")
            .setFooter(message.channel.guild.name, message.channel.guild.iconURL())
          for (const data of top10) {
            let guildName = client.guilds.cache.get(data.guild).name;
            embed.addField("**User**", `<@${data.user}>`, true)
            embed.addField("**Guild**", `${guildName}`, true)
            embed.addField("**Reason**", `${data.reason}`, true)
            embed.addField("**DATE**", `${data.date}`, true)
            embed.addField("**Ban Id**", `${data.id}`, true)
            embed.addField("**Type**", `${data.approved}`, true)
            embed.addField("**Length**", `${data.length}`, true)
            embed.addField("\u200B", "\u200B");
          }
          message.channel.send({ embeds: [embed] });
          return;
        } else if (banargs[1] == "pending") {
          const top10 = bansql.prepare("SELECT * FROM bans WHERE approved = 'PENDING' AND appealed ='No'").all();
          const embed = new Discord.MessageEmbed()
            .setAuthor(`GLOBAL BAN LIST`, message.channel.guild.iconURL())
            .setTitle('PENDING BANS')
            .setColor("#ff33ff")
            .setFooter(message.channel.guild.name, message.channel.guild.iconURL())
          for (const data of top10) {
            let guildName = client.guilds.cache.get(data.guild).name;
            embed.addField("**User**", `<@${data.user}>`, true)
            embed.addField("**Guild**", `>${guildName}`, true)
            embed.addField("**Reason**", `${data.reason}`, true)
            embed.addField("**DATE**", data.date, true)
            embed.addField("**Ban Id**", data.id, true)
            embed.addField("**Length**", `${data.length}`, true)
            embed.addField("\u200B", "\u200B");
          }
          message.channel.send({ embeds: [embed] });
          return;
        } else if (banargs[1] == "global") {
          const top10 = bansql.prepare("SELECT * FROM bans WHERE approved = 'GLOBAL'  AND appealed ='No'").all();
          const embed = new Discord.MessageEmbed()
            .setAuthor(`GLOBAL BAN LIST`, message.channel.guild.iconURL())
            .setTitle('GLOBALLY BANNED USERS')
            .setColor("#ff33ff")
            .setFooter(message.channel.guild.name, message.channel.guild.iconURL())
          for (const data of top10) {
            let guildName = client.guilds.cache.get(data.guild).name;
            embed.addField("**User**", `<@${data.user}>`, true)
            embed.addField("**Guild**", `>${guildName}`, true)
            embed.addField("**Reason**", `${data.reason}`, true)
            embed.addField("**DATE**", data.date, true)
            embed.addField("**Ban Id**", data.id, true)
            embed.addField("**Length**", `${data.length}`, true)
            embed.addField("\u200B", "\u200B");
          }
          message.channel.send({ embeds: [embed] });
          return;
        } else if (banargs[1] == "local") {
          const top10 = bansql.prepare("SELECT * FROM bans WHERE approved = 'LOCAL'  AND appealed ='No'").all();
          const embed = new Discord.MessageEmbed()
            .setAuthor(`GLOBAL BAN LIST`, message.channel.guild.iconURL())
            .setTitle('LOCALLY BANNED USERS')
            .setColor("#ff33ff")
            .setFooter(message.channel.guild.name, message.channel.guild.iconURL())
          for (const data of top10) {
            let guildName = client.guilds.cache.get(data.guild).name;
            embed.addField("**User**", `<@${data.user}>`, true)
            embed.addField("**Guild**", `>${guildName}`, true)
            embed.addField("**Reason**", `${data.reason}`, true)
            embed.addField("**DATE**", data.date, true)
            embed.addField("**Ban Id**", data.id, true)
            embed.addField("**Length**", `${data.length}`, true)
            embed.addField("\u200B", "\u200B");
          }
          message.channel.send({ embeds: [embed] });
          return;
        } else if (banargs[1] == "appealed") {
          const top10 = bansql.prepare("SELECT * FROM bans WHERE approved = 'GLOBAL' AND appealed ='Yes'").all();
          const embed = new Discord.MessageEmbed()
            .setAuthor(`GLOBAL BAN LIST`, message.channel.guild.iconURL())
            .setTitle('**SUCCESSFULLY APPEALED**')
            .setColor("#ff33ff")
            .setFooter(message.channel.guild.name, message.channel.guild.iconURL())
          for (const data of top10) {
            let guildName = client.guilds.cache.get(data.guild).name;
            embed.addField("**User**", `<@${data.user}>`, true)
            embed.addField("**Guild**", `>${guildName}`, true)
            embed.addField("**Reason**", `${data.reason}`, true)
            embed.addField("**DATE**", data.date, true)
            embed.addField("**Ban Id**", data.id, true)
            embed.addField("**Length**", `${data.length}`, true)
            embed.addField("\u200B", "\u200B");
          }
          message.channel.send({ embeds: [embed] });
          return;
        } else if (banargs[1] == "approve") {
          const bannedId = banargs[2];
          const top10 = bansql.prepare("SELECT * FROM bans WHERE id = ?").all(bannedId);
          for (const data of top10) {
            client.addBan = bansql.prepare(`UPDATE bans SET approved = 'GLOBAL' WHERE id = '${bannedId}';`).run();
            message.reply(`User : ${data.user} had their global ban approved..`)
            client.users.cache.find(user => user.id === data.user).send(`Your recent bans been marked as GLOBAL \n \n Moderators of servers you join will be notified for ${data.length} days that you were punished, To appeal join: https://discord.gg/ZqUSVpDcRq`);
            logMessage(client, "success", message.guild, `<@${message.author.id}> has marked a punishment on user: <@${data.user}> as aprooved`);
            return;
          }
        } else if (banargs[1] == "deny") {
          const bannedId = banargs[2];
          const top10 = bansql.prepare("SELECT * FROM bans WHERE id = ?").all(bannedId);
          for (const data of top10) {
            client.addBan = bansql.prepare(`UPDATE bans SET approved = 'LOCAL' WHERE id = '${bannedId}';`).run();
            message.reply(`User : ${data.user} had their global ban denied, set to LOCAL..`)
            client.users.cache.find(user => user.id === data.user).send(`Your recent bans been marked as LOCAL \n \n Moderators of servers you join will be notified for ${data.length} days that you were punished, To appeal join: https://discord.gg/ZqUSVpDcRq`);
            logMessage(client, "success", message.guild, `<@${message.author.id}> has marked a punishment on user: <@${data.user}> as denied`);
            return;
          }
        } else if (banargs[1] == "remove") {
          const bannedId = banargs[2];
          const top10 = bansql.prepare("SELECT * FROM bans WHERE id = ?").all(bannedId);
          for (const data of top10) {
            client.addBan = bansql.prepare(`UPDATE bans SET appealed = 'Yes' WHERE id = '${bannedId}';`).run();
            message.reply(`User : ${data.user} had their global ban marked as appealed.`)
            client.users.cache.find(user => user.id === data.user).send(`Your punishment appeal has been successful \n \n Moderators of servers you join will still be notified for ${data.length} days that you were banned, and then appealed a ban.`);
            logMessage(client, "success", message.guild, `<@${message.author.id}> has marked a punishment on user: <@${data.user}> as appealed`);
            return;
          }
        } else if (banargs[1] == "resetuser") {
          const bannedId = banargs[2];
          const top10 = bansql.prepare("SELECT * FROM bans WHERE user = ?").all(bannedId);
          for (const data of top10) {
            bansql.prepare(`DELETE FROM 'bans' WHERE user = '${bannedId}'`).run()
          }
          message.reply(`**WARNING** User : ${bannedId} has had **ALL** there punishment DELETED.`);
          logMessage(client, "success", message.guild, `<@${message.author.id}> has deleted all punishment on user: <@${bannedId}>`);
          return;
        } else if (banargs[1] == "delete") {
          const bannedId = banargs[2];
          const top10 = bansql.prepare("SELECT * FROM bans WHERE id = ?").all(bannedId);
          for (const data of top10) {
            bansql.prepare(`DELETE FROM 'bans' WHERE ID = '${data.id}'`).run()
            message.reply(`**WARNING** User : ${data.user} has had there punishment DELETED.`);
            logMessage(client, "success", message.guild, `<@${message.author.id}> has deleted a punishment on user: <@${bannedId}>`);
            return;
          }
        } else if (banargs[1] == "refresh") {
          message.reply("FORCING AN UPDATE ON BANLIST DATA!")
          refreshPunishDB(client);
          return;
        } else {
          message.reply("SYNTAX FOR BANLIST MANAGEMENT: \n ?@banlist add <user> <guild> <type> <length> <reason> \n ?@banlist edit <user> <type/length/reason> \n ?@banlist user <userid> (Lists a users punishments) \n ?@banlist guild <guildid> (Lists all guild's punishments) \n ?@banlist local (lists all Local Bans) \n ?@banlist appealed (Lists all Appealed Bans \n ?@banlist global (Lists all global ) \n  ?@banlist pending (Lists all pending bans) \n ?@banlist approve <banid> (Sets a pending ban to global) \n ?@banlist deny <banid> (Sets a pending ban to local) \n ?@banlist remove <banid> (Sets a ban as appealed> \n ?@banlist delete <banid> (Delets the ban from the DB)");
          logMessage(client, "success", message.guild, `${message.author.tag}  Admin Command Attempted but Failed`);
          return;
        }
      }
      else if (banargs[0] == "?@leave") {
        try {
          client.guilds.cache.get(banargs[1]).leave()
            .catch(err => {
              console.log(`there was an error leaving the guild: \n ${err.message}`);
            })
          message.reply(`I have now left: ${banargs[1]}.`)
          return;
        } catch (err) {
          console.log(err);
          logMessage(client, "error", message.guild, `Error at line 669: ${err} (messageCreate)`);
          message.reply(`There was an error! - ${err}`)
          return
        }

      }
      else if (banargs[0] == "?@refreshcmds") {
        if (banargs[1]) {
          try {
            client.api.applications(client.user.id).guilds(banargs[1]).commands("command-name (joke)").delete();
            message.reply(`I have now reset application commands for: ${banargs[1]}.`)
            return;
          } catch (err) {
            console.log(err);
            logMessage(client, "error", message.guild, `Error at line 682: ${err} (messageCreate)`);
            message.reply(`There was an error! - ${err}`)
            return
          }
        } else {
          client.api.applications(client.user.id).commands("command-id (interaction.data.id)").delete();
        }

      }
      else if (banargs[0] == "?@guildban") {
        if (banargs[1] == "add") {
          try {

            bannedbanid2 = Math.floor(Math.random() * 9999999999) + 25;
            bannedreason = banargs.slice(3).join(' ');
            client.addBan = botsql.prepare("INSERT INTO guildadmin (id, account, reason, type) VALUES (@id, @account, @reason, @type);");
            score = { id: `${bannedbanid2}`, account: banargs[2], type: 'GUILDBAN', reason: bannedreason };
            client.addBan.run(score);
            message.reply(`**GUILD BAN**I will no longer join Guild iD: ${banargs[2]} for reason: ${bannedreason}`)
            logMessage(client, "success", message.guild, `${message.author.tag}  **GUILD BAN**I will no longer join Guild iD: ${banargs[2]} for reason: ${bannedreason}`);
            return;
          } catch (err) {
            console.log(err);
            message.reply(`There was an error! - ${err}`)
            return
          }
        }
        else if (banargs[1] == "remove") {
          client.addBan = botsql.prepare(`DELETE FROM guildadmin WHERE account = '${banargs[2]}'`).run();
          message.reply(`I will now accept invites to join Guild: ${banargs[2]}`)
          logMessage(client, "success", message.guild, `${message.author.tag}  **GUILD BAN**I will now join Guild iD: ${banargs[2]}`);
          return;

        }
        else if (banargs[1] == "list") {
          const top10 = botsql.prepare(`SELECT * FROM guildadmin WHERE type = 'GUILDBAN'`).all();
          const embed = new Discord.MessageEmbed()
            .setTitle('**GUILD BAN LIST**')
            .setColor("#ff33ff")
            .setFooter(message.channel.guild.name, message.channel.guild.iconURL())
          for (const data of top10) {
            embed.addField("**Guild**", data.account, false)
            embed.addField("**Reason**", `${data.reason}`, true)
          }
          message.channel.send({ embeds: [embed] });
          logMessage(client, "success", message.guild, `${message.author.tag}  **GUILD BAN** Listed Guild Bans`);
          return;
        }
      }
      else if (banargs[0] == "?@dashboard") {
        if (banargs[1] == "block") {
          try {
            const botsql = new SQLite(`./databases/bot.sqlite`);
            bannedbanid2 = Math.floor(Math.random() * 9999999999) + 25;
            bannedreason = banargs.slice(3).join(' ');
            client.addBan = botsql.prepare("INSERT INTO guildadmin (id, account, reason, type) VALUES (@id, @account, @reason, @type);");
            score = { id: `${bannedbanid2}`, account: banargs[2], type: 'DASHBLOCK', reason: bannedreason };
            client.addBan.run(score);
            message.reply(`I will no longer allow: ${banargs[2]} to login to the dashboard for reason: ${bannedreason}`);
            logMessage(client, "success", message.guild, `${message.author.tag}  I will no longer allow: ${banargs[2]} to login to the dashboard for reason: ${bannedreason}`);
            return;
          } catch (err) {
            console.log(err);
            message.reply(`There was an error! - ${err}`)
            return
          }
        } else if (banargs[1] == "unblock") {
          client.addBan = botsql.prepare(`DELETE FROM guildadmin WHERE account = '${banargs[2]}'`).run();
          message.reply(`I will now re-allow: ${banargs[2]} to login to the dashboard`)
          logMessage(client, "success", message.guild, `${message.author.tag}  I will now allow: ${banargs[2]} to login to the dashboard`);
          return;
        }
        else if (banargs[1] == "list") {
          const top10 = botsql.prepare(`SELECT * FROM guildadmin WHERE type = 'DASHBLOCK'`).all();
          const embed = new Discord.MessageEmbed()
            .setTitle('**DASHBOARD BLOCK LIST**')
            .setColor("#ff33ff")
            .setFooter(message.channel.guild.name, message.channel.guild.iconURL())
          for (const data of top10) {
            embed.addField("**User**", data.account, false)
            embed.addField("**Reason**", `${data.reason}`, true)
          }
          message.channel.send({ embeds: [embed] });
          logMessage(client, "success", message.guild, `${message.author.tag}  Listed all blocked users from the dashboard`);
          return;
        }

      }
      else if (banargs[0] == "?@invite") {
        try {
          let guilddata = client.guilds.cache.get(banargs[1]);
          //console.log(guilddata);
          const channel = guilddata.channels.cache.filter(m => m.type === 'GUILD_TEXT').first();
          //console.log(channel);
          await channel.createInvite({})
            .then(async (invite) => {
              message.reply(`${invite.url}`); // push invite link and guild name to array
              logMessage(client, "success", message.guild, `${message.author.tag} Forced an invite to ${banargs[1]}`);
            })
            .catch((error) => message.reply(`There was an error! - ${error}`));

          return
        } catch (err) {
          console.log(err);
          logMessage(client, "error", message.guild, `${message.author.tag} Error: 787 Invite Error: ${err}`);
          message.reply(`There was an error! - ${err}`)
          return
        }
      }
      else if (banargs[0] == "?@listall") {
        const embed = new Discord.MessageEmbed()
          .setTitle('**ALL DISCORD SERVERS**')
          .setColor("#ff33ff")
          .setFooter(message.channel.guild.name, message.channel.guild.iconURL())
        client.guilds.cache.forEach(guild => {
          embed.addField(`${guild.name}`, `${guild.id}`, true)
        })
        message.channel.send({ embeds: [embed] });
        logMessage(client, "error", message.guild, `${message.author.tag} Listed all discord servers`);
        return;
      }
      else if (banargs[0] == "?@reset") {
        const supsql3 = new SQLite(`./databases/support.sqlite`);
        const rrsql3 = new SQLite(`./databases/rr.sqlite`);
        const scresql3 = new SQLite(`./databases/scores.sqlite`);
        const bansql3 = new SQLite(`./databases/bans.sqlite`);
        supsql3.prepare(`DELETE FROM 'tickets' WHERE guild = '${banargs[1]}'`).run()
        rrsql3.prepare(`DELETE FROM 'rrtable' WHERE guild = '${banargs[1]}'`).run()
        scresql3.prepare(`DELETE FROM 'scores' WHERE guild = '${banargs[1]}'`).run()
        const top10 = bansql.prepare("SELECT * FROM bans WHERE id = ?").all(banargs[1]);
        if (top10) {
          for (const data of top10) {
            try {
              client.users.cache.get(data.user).send(`Ban on Guild ID ${banargs[1]} has been removed as the bot has been removed or been deleted or reset.`);
              logMessage(client, "success", message.guild, `${message.author.tag} Reset users punishments on ${banargs[1]}`);
            }
            catch (err) {
              // do nothing
            }

          }
          bansql.prepare(`DELETE FROM 'bans' WHERE guild = '${banargs[1]}'`).run()
        }
        client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`** WARNING ** All Data on Guild ID ${banargs[1]} has been deleted as the Server got reset by ${message.author.id}.`);
        message.reply(`${banargs[1]} DATA HAS BEEN RESET`);
        logMessage(client, "success", message.guild, `${message.author.tag} Reset users punishments on GUILD ${banargs[1]}`);
        return;
      }
    }
    // And we save it!
  }




  let prefix = client.settings.get(message.guild.id, `prefix`)
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})`);
  if (!prefixRegex.test(message.content)) return;
  const [, mPrefix] = message.content.match(prefixRegex);
  const args = message.content.slice(mPrefix.length).trim().split(/ +/).filter(Boolean);
  const cmd = args.length > 0 ? args.shift().toLowerCase() : null;
  if (!cmd || cmd.length == 0) {
    if (mPrefix.includes(client.user.id)) {
      message.reply({ embeds: [new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(`:thumbsup: **My Prefix here, is __\`${prefix}\`__**`)] })
    }
    return;
  }
  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));
  if (command) {
    if (client.settings.get(message.guild.id, `botchannel`).length > 0) {
      let botchannels = client.settings.get(message.guild.id, `botchannel`);
      if (!botchannels || !Array.isArray(botchannels)) botchannels = [];
      if (botchannels.length > 0) {
        if (!botchannels.includes(message.channel.id) && !message.member.permissions.has("ADMINISTRATOR")) {
          return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle(`${client.allEmojis.x} **You are not allowed to use this Command in here!**`)
              .setDescription(`Please do it in one of those:\n> ${botchannels.map(c => `<#${c}>`).join(", ")}`)
            ]
          })
        }
      }
    }
    //Check if user is on cooldown with the cmd, with Tomato#6966's Function from /handlers/functions.js
    if (onCoolDown(message, command)) {
      return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(replacemsg(settings.messages.cooldown, {
            prefix: prefix,
            command: command,
            timeLeft: onCoolDown(message, command)
          }))]
      });
    }
    try {
      //if Command has specific permission return error
      if (command.memberpermissions && command.memberpermissions.length > 0 && !message.member.permissions.has(command.memberpermissions)) {
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(replacemsg(settings.messages.notallowed_to_exec_cmd.title))
            .setDescription(replacemsg(settings.messages.notallowed_to_exec_cmd.description.memberpermissions, {
              command: command,
              prefix: prefix
            }))]
        }).then(msg => { setTimeout(() => { msg.delete().catch((e) => { console.log(String(e).grey) }) }, settings.timeout.notallowed_to_exec_cmd.memberpermissions) }).catch((e) => { console.log(String(e).grey) });
      }
      //if Command has specific needed roles return error
      if (command.requiredroles && command.requiredroles.length > 0 && message.member.roles.cache.size > 0 && !message.member.roles.cache.some(r => command.requiredroles.includes(r.id))) {
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(replacemsg(settings.messages.notallowed_to_exec_cmd.title))
            .setDescription(replacemsg(settings.messages.notallowed_to_exec_cmd.description.requiredroles, {
              command: command,
              prefix: prefix
            }))]
        }).then(msg => { setTimeout(() => { msg.delete().catch((e) => { console.log(String(e).grey) }) }, settings.timeout.notallowed_to_exec_cmd.requiredroles) }).catch((e) => { console.log(String(e).grey) });

      }
      //if Command has specific users return error
      if (command.alloweduserids && command.alloweduserids.length > 0 && !command.alloweduserids.includes(message.author.id)) {
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(replacemsg(settings.messages.notallowed_to_exec_cmd.title))
            .setDescription(replacemsg(settings.messages.notallowed_to_exec_cmd.description.alloweduserids, {
              command: command,
              prefix: prefix
            }))]
        }).then(msg => { setTimeout(() => { msg.delete().catch((e) => { console.log(String(e).grey) }) }, settings.timeout.notallowed_to_exec_cmd.alloweduserids) }).catch((e) => { console.log(String(e).grey) });
      }
      //if command has minimum args, and user dont entered enough, return error
      if (command.minargs && command.minargs > 0 && args.length < command.minargs) {
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.x} Wrong Command Usage!`)
            .setDescription(command.argsmissing_message && command.argsmissing_message.trim().length > 0 ? command.argsmissing_message : command.usage ? `Usage: ` + command.usage : `Wrong Command Usage`)]
        }).then(msg => { setTimeout(() => { msg.delete().catch((e) => { console.log(String(e).grey) }) }, settings.timeout.minargs) }).catch((e) => { console.log(String(e).grey) });
      }
      //if command has maximum args, and user enters too many, return error
      if (command.maxargs && command.maxargs > 0 && args.length > command.maxargs) {
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.x} Wrong Command Usage!`)
            .setDescription(command.argstoomany_message && command.argstoomany_message.trim().length > 0 ? command.argstoomany_message : command.usage ? `Usage: ` + command.usage : `Wrong Command Usage`)]
        }).then(msg => { setTimeout(() => { msg.delete().catch((e) => { console.log(String(e).grey) }) }, settings.timeout.maxargs) }).catch((e) => { console.log(String(e).grey) });
      }

      //if command has minimum args (splitted with `++`), and user dont entered enough, return error
      if (command.minplusargs && command.minplusargs > 0 && args.join(` `).split(`++`).filter(Boolean).length < command.minplusargs) {
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.x} Wrong Command Usage!`)
            .setDescription(command.argsmissing_message && command.argsmissing_message.trim().length > 0 ? command.argsmissing_message : command.usage ? `Usage: ` + command.usage : `Wrong Command Usage`)]
        }).then(msg => { setTimeout(() => { msg.delete().catch((e) => { console.log(String(e).grey) }) }, settings.timeout.minplusargs) }).catch((e) => { console.log(String(e).grey) });
      }
      //if command has maximum args (splitted with `++`), and user enters too many, return error
      if (command.maxplusargs && command.maxplusargs > 0 && args.join(` `).split(`++`).filter(Boolean).length > command.maxplusargs) {
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.x} Wrong Command Usage!`)
            .setDescription(command.argstoomany_message && command.argstoomany_message.trim().length > 0 ? command.argsmissing_message : command.usage ? `Usage: ` + command.usage : `Wrong Command Usage`)]
        }).then(msg => { setTimeout(() => { msg.delete().catch((e) => { console.log(String(e).grey) }) }, settings.timeout.maxplusargs) }).catch((e) => { console.log(String(e).grey) });
      }
      //run the command with the parameters:  client, message, args, Cmduser, text, prefix,
      command.run(client, message, args, args.join(` `).split(`++`).filter(Boolean), message.member, args.join(` `), prefix);
      logMessage(client, "success", message.guild, `${message.guild.name} triggered command: ${command.name}`);
    } catch (error) {
      logMessage(client, "error", message.guild, `${message.guild.name} had an error for a command on: ${error}`);
      if (settings.somethingwentwrong_cmd) {
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(replacemsg(settings.messages.somethingwentwrong_cmd.title, {
              prefix: prefix,
              command: command
            }))
            .setDescription(replacemsg(settings.messages.somethingwentwrong_cmd.description, {
              error: error,
              prefix: prefix,
              command: command
            }))]
        }).then(msg => { setTimeout(() => { msg.delete().catch((e) => { console.log(String(e).grey) }) }, 4000) }).catch((e) => { console.log(String(e).grey) });
      }
    }
  }
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
function escapeRegex(str) {
  try {
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  } catch {
    return str
  }
}
