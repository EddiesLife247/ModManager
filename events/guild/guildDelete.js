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
const supsql = new SQLite(`./databases/support.sqlite`);
const rrsql = new SQLite(`./databases/rr.sqlite`);
const scresql = new SQLite(`./databases/scores.sqlite`);
const bansql = new SQLite(`./databases/bans.sqlite`);
module.exports = async (client, guild) => {
  supsql.prepare(`DELETE FROM 'tickets' WHERE guild = '${guild.id}'`).run()
  rrsql.prepare(`DELETE FROM 'rrtable' WHERE guild = '${guild.id}'`).run()
  scresql.prepare(`DELETE FROM 'scores' WHERE guild = '${guild.id}'`).run()
  client.settings.ensure(guild.id, {
    prefix: config.prefix,
    defaultvolume: 50,
    defaultautoplay: false,
    defaultfilters: [`bassboost6`, `clear`],
    djroles: [],
    botchannel: [],
    logxhannel: [],
  })
  if (!guild.available) return; // If there is an outage, return.
  let ErrorEmbed = new Discord.MessageEmbed()
    .setTitle(`I Left a server`)
    .addField('Server ID: ', `${guild.id}`, true)
    .addField('Server Name: ', `${guild.name}`, true)
    .setColor([255, 0, 0]);
  client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send({ embeds: [ErrorEmbed] });
  client.getBanned = bansql.prepare("SELECT * FROM bans WHERE guild = ?");
  const globalBanned;
  globalBanned = client.getBanned.get(guild.id);
  if (globalBanned) {
    for (const data of globalBanned) {
      try {
        client.users.cache.get(data.user).send(`Ban on ${guild.name} has been removed as the bot has been removed or been deleted.`);
      }
      catch (err) {
        // do nothing
      }

    }
    bansql.prepare(`DELETE FROM 'bans' WHERE guild = '${guild.id}'`).run()
    client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`Punishments on ${guild.name} has been removed as the bot has been removed.`);
  }
  //logger.log(`[GUILD LEAVE] ${guild.id} removed the bot.`);

  //guild.channels.cache.find(c => c.id == client.settings.get(guild.id, "logchannel")).send({ embeds: [embed] });
  // If the settings Enmap contains any guild overrides, remove them.
  // No use keeping stale data!
  if (client.settings.has(guild.id)) {
    client.settings.delete(guild.id);
  }
};
