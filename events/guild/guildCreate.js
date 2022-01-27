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
module.exports = async (client, guild) => {
  

  const SQLite = require("better-sqlite3");
  const botsql = new SQLite(`./databases/bot.sqlite`);
  const top10 = botsql.prepare("SELECT * FROM guildadmin WHERE account = ? AND type = 'GUILDBAN'").all(guild.id);
  if (top10.length >= 1) {
    for (const data of top10) {
      const channel = guild.channels.cache.filter(m => m.type === 'GUILD_TEXT').first();
      channel.send(`Sorry, ModManager is not permitted to join this server for: \`\`\`${data.reason} \`\`\` Contact support if you think this is an error: https://discord.gg/ZqUSVpDcRq`)
      client.guilds.cache.get(guild.id).leave()
      logMessage(client, "success", guild, `Joined and Left due to Guild Ban for reason: ${data.reason}`);
    }
  }


  // This is the same as the ready even
  client.settings.ensure(guild.id, {
    prefix: config.prefix,
    defaultvolume: 50,
    defaultautoplay: false,
    defaultfilters: [`bassboost6`, `clear`],
    djroles: [],
    botchannel: [],
    logxhannel: [],
  })
  //logger.log(`[GUILD JOIN] ${guild.id} added the bot. Owner: ${guild.ownerId}`);
  let JoinEmbed = new Discord.MessageEmbed()
    .setTitle(`I joined a server`)
    .addField('Server ID: ', `${guild.id}`, true)
    .addField('Server Name: ', `${guild.name}`, true)
    .addField('Server Owner: ', `${guild.ownerID}`, true)
    .setColor([0, 255, 0]);
  client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send({ embeds: [JoinEmbed] }); // used for specific channel
};
