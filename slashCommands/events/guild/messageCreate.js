//Import Modules
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require(`../../handlers/functions`);
const Discord = require(`discord.js`);
const SQLite = require("better-sqlite3");
const sql = new SQLite(`./databases/scores.sqlite`);
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
    logchannel: [],
    topicmodlogs: true,
    randomtopic: [],
    qotdchannel: [],
    levelupchan: [],
    swearfilter: false,
    urlfilter: false,
    invitefilter: false,
  })
  const prefixMention = new RegExp(`^<@!?${client.user.id}> ?$`);
  if (message.content.match(prefixMention)) {
    return message.reply(`My prefix on this guild is \`${client.settings.get(message.guild.id, "prefix")}\``);
  }
  const forbidenWords = ['fuck', 'shit', 'bollocks', 'twat', 'nigger', 'bastard', 'cunt', '.xxx', 'XX'];
  const urlDeny = ['http', 'https', '.com', 'www', '.co.uk', '.uk', '.xl'];
  if (client.settings.get(message.guild.id, "swearfilter") == true) {
    //console.log(message.channel);
    if (message.channel.nsfw == false) {
      try {
        var customFilter = new Filter({ placeHolder: 'XX' });
        if (message.content == null) {
          // NO NEED TO CHECK ITS NOTHING!
        } else {
          const msg = customFilter.clean(message.content);
          for (var i = 0; i < forbidenWords.length; i++) {
            if (msg.includes(forbidenWords[i])) {

              message.channel.send(`Please do not swear on this server! <@${message.author.id}>`);
              message.delete();
              return;
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
        if (message.author.id === message.guild.ownerID) return console.log("owner override");
        await message.delete();
        await message.channel.send(`You cannot send invites to other Discord servers`);
      }
    } catch (e) {
      console.log(e);
    }
  }
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
          message.channel.send(`Please do not post links on this server! <@${message.author.id}>. Only YouTube links are permitted with the Music Command at this time`);
          message.delete();
          return;
          //Cancel Message and don't count to points.
        }
      }
    }
  }
  client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
  client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");

  // POINTS CODE
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

  // ADMINISTRATOR COMMANDS
  const bansql = new SQLite(`./databases/bans.sqlite`);
  if (message.guild.id == "787871047139328000") {
    if (message.channel.id == "901905815810760764") {
      const banargs = message.content.split(' ');
      //console.log(banargs[0]);
      if (banargs[0] == "?@banlist") {
        if (banargs[1] == "pending") {
          const top10 = bansql.prepare("SELECT * FROM bans WHERE approved = 'PENDING' AND appealed ='No'").all();
          const embed = new Discord.MessageEmbed()
            .setAuthor(`GLOBAL BAN LIST`, message.channel.guild.iconURL())
            .setTitle('PENDING BANS')
            .setColor("#ff33ff")
            .setFooter(message.channel.guild.name, message.channel.guild.iconURL())
          for (const data of top10) {
            embed.addField("**User**", `<@${data.user}>`, true)
            embed.addField("**Guild**", `${data.guild}`, true)
            embed.addField("**Reason**", `${data.reason}`, true)
            embed.addField("**DATE**", data.date, true)
            embed.addField("**Ban Id**", data.id, true)
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
            embed.addField("**User**", `<@${data.user}>`, true)
            embed.addField("**Guild**", `${data.guild}`, true)
            embed.addField("**Reason**", `${data.reason}`, true)
            embed.addField("**DATE**", data.date, true)
            embed.addField("**Ban Id**", data.id, true)
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
            embed.addField("**User**", `<@${data.user}>`, true)
            embed.addField("**Guild**", `${data.guild}`, true)
            embed.addField("**Reason**", `${data.reason}`, true)
            embed.addField("**DATE**", data.date, true)
            embed.addField("**Ban Id**", data.id, true)
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
            client.users.cache.find(user => user.id === data.user).send('Your recent bans been marked as GLOBAL \n \n Moderators of servers you join will be notified for 60 days that you were banned, To appeal join: https://discord.gg/ZqUSVpDcRq');
            client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`<@${message.author.id}> has marked a global ban on user: <@${data.user} as aprooved`);
          }
        } else if (banargs[1] == "remove") {
          const bannedId = banargs[2];
          const top10 = bansql.prepare("SELECT * FROM bans WHERE id = ?").all(bannedId);
          for (const data of top10) {
            client.addBan = bansql.prepare(`UPDATE bans SET appealed = 'Yes' WHERE id = '${bannedId}';`).run();
            message.reply(`User : ${data.user} had their global ban marked as appealed.`)
            client.users.cache.find(user => user.id === data.user).send('Your ban appeal has been successful \n \n Moderators of servers you join will still be notified for 60 days that you were banned, and then appealed a ban.');
            client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`<@${message.author.id}> has marked a global ban on user: <@${data.user} as successfully appealed`);
          }
        } else if (banargs[1] == "delete") {
          const bannedId = banargs[2];
          const top10 = bansql.prepare("SELECT * FROM bans WHERE id = ?").all(bannedId);
          for (const data of top10) {
            bansql.prepare(`DELETE FROM 'bans' WHERE ID = '${data.id}'`).run()
            message.reply(`**WARNING** User : ${data.user} has had there ban DELETED.`);
            client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`<@${message.author.id}> has deleted a ban on user: <@${data.user}`);
          }
        }
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
      if (!client.settings.get(message.guild.id, `botchannel`).includes(message.channel.id) && !message.member.permissions.has("ADMINISTRATOR")) {
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.x} **You are not allowed to use this Command in here!**`)
            .setDescription(`Please do it in one of those:\n> ${client.settings.get(message.guild.id, `botchannel`).map(c => `<#${c}>`).join(", ")}`)
          ]
        })
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
      client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${message.guild.name} triggered command: ${command.name}`);
    } catch (error) {
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
  } else //if the command is not found send an info msg
    return message.reply({
      embeds: [new Discord.MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(replacemsg(settings.messages.unknown_cmd, {
          prefix: prefix
        }))]
    }).then(msg => { setTimeout(() => { msg.delete().catch((e) => { console.log(String(e).grey) }) }, 4000) }).catch((e) => { console.log(String(e).grey) });
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
