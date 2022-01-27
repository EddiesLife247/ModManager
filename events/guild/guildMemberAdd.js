const {
  MessageEmbed,
  Message
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require(`../../handlers/functions`);
const { logMessage } = require(`../../handlers/newfunctions`);
const Discord = require(`discord.js`);
const SQLite = require("better-sqlite3");
module.exports = async (client, member) => {
  client.settings.ensure(member.guild.id, {
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
    globalbans: false,
    welcomechannel: [],
    welcomemsg: '',
    acceptedtrust: '',
    joinrole: [],
    staffchan: [],
  })
  const guild = member.guild;
  if (guild.me.permissions.has("VIEW_AUDIT_LOG")) {
    const bansql = new SQLite(`./databases/bans.sqlite`);
    const localBanCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'LOCAL' AND user = ${member.id}`).all();
    //console.log(localBanCount.length);
    const globalBanCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'GLOBAL' AND user = ${member.id}`).all();
    const KickCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'KICK' AND user = ${member.id}`).all();
    const warningCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'WARNING' AND user = ${member.id}`).all();
    const timeoutCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'TIMEOUT' AND user = ${member.id}`).all();
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
    //console.log(member.user.avatar);
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
    //console.log(`${trustlevel} out of a possible 55 points.`);
    //console.log('----------');
    ///console.log(reason);
    if (client.settings.get(member.guild.id, "acceptedtrust")) {
      acceptedtrust = client.settings.get(member.guild.id, "acceptedtrust");
      if (acceptedtrust >= trustlevel) {
        await member.send(`Sorry you do not meet the acceptable trust level requirements for this server! The reasons you did not meet this requirement were: ${reason}`);
        member.kick(`[AUTO] User does not meet accepted trust level for this server.`);
        logMessage(client, "success", member.guild, `${member.user.tag} Attempted to join, but was removed due to LOW trust Level: ${trustLevel} with accepted Trust level: ${acceptedtrust}`);

      }
    } else {
      acceptedtrust = "Disabled on this server";
    }

    client.getBanned = bansql.prepare("SELECT * FROM bans WHERE user = ?  AND approved = 'GLOBAL' AND appealed = 'No'");
    let globalBanned;
    globalBanned = client.getBanned.get(member.user.id);
    if (globalBanned) {
      // Check if user has joined support server
      if (member.guild.id == '787871047139328000') {
        //if so set their role to the "GLOBAL BANNED" role.
        var role = member.guild.roles.cache.find(role => role.id === "901933035342159932");
        member.roles.add(role.id);
        logMessage(client, "success", member.guild, `${member.user.tag} Attempted to join, but was removed due to Being Global Banned`);
      } else {
        console.log(client.settings.get(member.guild.id, "globalbans"));
        if (client.settings.get(member.guild.id, "globalbans") == true) {
          // DO THIS
          if (!client.settings.get(guild.id, "staffchan").length === 0) {
            const staffchan = guild.channels.cache.find(c => c.id == client.settings.get(guild.id, "staffchan"));
            staffchan.send(`${member.user.tag} - Recently Joined and has been added to the global ban database. \n \n They were banned for: \`\`\` ${globalBanned.reason}\`\`\` The user will now be banned from this guild.`)
          }
          else {
            member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel")).send(`${member.user.tag} - Recently Joined and has been added to the global ban database. \n \n They were banned for: \`\`\` ${globalBanned.reason}\`\`\` The user will now be banned from this guild.`);
          }
          await member.send(`**Hello, You Have Been Banned From ${member.guild.name} ** GLOBAL BAN IN FORCE** \n \n To appeal this ban please visit our support server: https://discord.gg/ZqUSVpDcRq`).catch(() => null)
          member.guild.members.ban(member.id)
        } else {
          if (!client.settings.get(guild.id, "staffchan").length === 0) {
            const staffchan = guild.channels.cache.find(c => c.id == client.settings.get(guild.id, "staffchan"));
            staffchan.send(`** WARNING: ** ${member.user.tag} - Recently Joined and has been added to the global ban database. \n \n They were banned for: \`\`\` ${globalBanned.reason}\`\`\` \n \n Global Bans have been disabled on this server.`)
          }
          else {
            member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel")).send(`** WARNING: ** ${member.user.tag} - Recently Joined and has been added to the global ban database. \n \n They were banned for: \`\`\` ${globalBanned.reason}\`\`\` \n \n Global Bans have been disabled on this server.`);
          }
          member.send(`**WARNING: Your username has been added to our global ban database, appeal via email to: https://discord.gg/ZqUSVpDcRq **`).catch(() => null)
        }
      }
    }
    client.getAppealed = bansql.prepare("SELECT * FROM bans WHERE user = ?  AND approved = 'GLOBAL' AND appealed = 'Yes'");
    globalAppealed = client.getAppealed.get(member.user.id);
    if (globalAppealed) {
      member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel")).send(`${member.user.tag} - Recently Joined member has been added to the global ban list, but has appealed their ban successfully \n \n They were banned for: \`\`\` ${globalAppealed.reason}\`\`\` `);
      member.send(`**WARNING:** Your account has been previously banned and you have a successful appeal, this will be sent to new servers for the next 60 days`).catch(() => null)
    }



    // A pretty useful method to create a delay without blocking the whole script.
    /*console.log(newInvites);
    // This is the *existing* invites for the guild.
    const oldInvites = client.invites.get(member.guild.id);
    console.log(oldInvites);
    // Look through the invites, find the one for which the uses went up.
    const invite = newInvites.find(i => i.uses > oldInvites.get(i.code));
    // This is just to simplify the message being sent below (inviter doesn't have a tag property)
    const inviter = client.users.cache.get(invite.inviter.id);
          .addField("**Invitee**", `${inviter.tag}`, true)
      .addField("**Invite Code**", `${invite.code}`, true)
            .addField("**Invite Uses**", `${invite.uses} `, true)
    */
    // Look through the invites, find the one for which the uses went up.

    const embed = new Discord.MessageEmbed()
      .setAuthor(`Modlogs`, member.guild.iconURL())
      .setColor("#00ff00")
      .setFooter(member.guild.name, member.guild.iconURL())
      .setTitle("**Moderation** - New Member")
      .addField("**Member**", `${member.user.tag}`)
      .addField("**Local Ban(s)**", `${localBanCount.length}`, true)
      .addField("**Global Ban(s)**", `${globalBanCount.length}`, true)
      .addField("**Kick(s)**", `${KickCount.length}`, true)
      .addField("**Timedout(s)**", `${timeoutCount.length}`, true)
      .addField("**Warnings**", `${warningCount.length}`, true)
      .addField("**User's Trust level /60**", `${trustlevel}`, true)
      .addField("**How the score was calculated.**", `${reason}`)
      .addField("**USER HISTORY: **", `http://modmanager.manumission247.co.uk:38455/bans/${member.user.id}`)
      .setURL(`http://modmanager.manumission247.co.uk:38455/bans/${member.user.id}`)
      .setTimestamp();
    // Load the guild's settings
    //console.log(member);

    //console.log(channel.guild.channels.cache.find(c => c.name == settings.modLogChannel));
    //console.log(`member joined guild that has logs enabled!`);
    if (member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel"))) {
      member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel")).send({ embeds: [embed] });
      logMessage(client, "success", member.guild, `${member.user.tag} Joined a discord server.`);
      //console.log(`Found log channel and sent message: ${settings.modLogChannel} in ${member.guild.id}`);
    } else {
      //console.log(`Cannot find channel: ${settings.modLogChannel} in: ${member.guild.name}`);
    }

    if (!client.settings.get(member.guild.id, "staffchan") == null) {
      console.log(client.settings.get(member.guild.id, "staffchan"))
      const staffchan = member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "staffchan")).send({ embeds: [embed] });
    }
    else {
    }

    // WELCOME ALERT

    if (client.settings.get(member.guild.id, "welcomemsg")) {
      if (member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "welcomechannel"))) {
        const welcomeMessage = `<@${member.user.id}>, ` + client.settings.get(member.guild.id, "welcomemsg");
        member.guild.channels.cache.find(c => c.id === client.settings.get(member.guild.id, "welcomechannel")).send(welcomeMessage).catch(console.error);
        return;
      }
    }

    // JOIN ROLE
    if (!client.settings.get(member.guild.id, "joinrole") == null) {
      member.roles.add(client.settings.get(member.guild.id, "joinrole"));
    }
  }
};
