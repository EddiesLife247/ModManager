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
  })
  const bansql = new SQLite(`./databases/bans.sqlite`);
  client.getBanned = bansql.prepare("SELECT * FROM bans WHERE user = ?  AND approved = 'GLOBAL' AND appealed = 'No'");
  let globalBanned;
  globalBanned = client.getBanned.get(member.user.id);
  if (globalBanned) {
    // Check if user has joined support server
    if (member.guild.id == '787871047139328000') {
      //if so set their role to the "GLOBAL BANNED" role.
      var role = member.guild.roles.cache.find(role => role.id === "901933035342159932");
      member.roles.add(role.id);
      member.guild.channels.cache.find(c => c.id == "901905815810760764").send(`${member.user.tag} has joined and has been global banned. They can now only see <#901932935517704203>`);

    } else {
      console.log(client.settings.get(member.guild.id, "globalbans"));
      if (client.settings.get(member.guild.id, "globalbans") == true) {
        // DO THIS
        member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel")).send(`${member.user.tag} - Recently Joined and has been added to the global ban database. \n \n They were banned for: \`\`\` ${globalBanned.reason}\`\`\` The user will now be banned from this guild.`);
        await member.send(`**Hello, You Have Been Banned From ${member.guild.name} ** GLOBAL BAN IN FORCE** \n \n To appeal this ban please visit our support server: https://discord.gg/ZqUSVpDcRq`).catch(() => null)
        member.guild.members.ban(member.id)
      } else {
        member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel")).send(`** WARNING: ** ${member.user.tag} - Recently Joined and has been added to the global ban database. \n \n They were banned for: \`\`\` ${globalBanned.reason}\`\`\` \n \n Global Bans have been disabled on this server.`);
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

  // Load the guild's settings
  //console.log(member);
  if (member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel"))) {
    //console.log(channel.guild.channels.cache.find(c => c.name == settings.modLogChannel));
    //console.log(`member joined guild that has logs enabled!`);
    const localBanCount = bansql.prepare("SELECT * FROM bans WHERE approved = 'LOCAL'").all();
    console.log(localBanCount.length);
    const globalBanCount = bansql.prepare("SELECT * FROM bans WHERE approved = 'GLOBAL'").all();

    const embed = new Discord.MessageEmbed()
      .setAuthor(`Modlogs`, member.guild.iconURL())
      .setColor("#00ff00")
      .setFooter(member.guild.name, member.guild.iconURL())
      .setTitle("**Moderation** - New Member")
      .addField("**Member**", `${member.user.tag}`)
      .addField("**Local Bans**", `${localBanCount.length}`)
      .addField("**Global Bans**", `${globalBanCount.length}`)
      .setTimestamp();
    if (member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel"))) {
      member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel")).send({ embeds: [embed] });

      //console.log(`Found log channel and sent message: ${settings.modLogChannel} in ${member.guild.id}`);
    } else {
      //console.log(`Cannot find channel: ${settings.modLogChannel} in: ${member.guild.name}`);
    }

  }
  else {
    //console.log(`member joined guild that has logs disabled!`);
    return;
  }
  client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${member.guild.name} triggered event: GuildMemberAdd Successfully`);
  // WELCOME ALERT
  /*
  if (settings.welcomeEnabled == "true") {
    const welcomeMessage = settings.welcomeMessage.replace("{{user}}", `<@${member.user.id}>`);
    member.guild.channels.cache.find(c => c.name === client.settings.welcomeChannel).send(welcomeMessage).catch(console.error);
    return;
  }
  */
};
