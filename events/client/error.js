//here the event starts
const {
  MessageEmbed,
  Message,
  PermissionsBitField,
  AuditLogEvent,
  EmbedBuilder
} = require("discord.js");
const config = require(`../../configs/config.json`);
const Discord = require(`discord.js`);
const SQLite = require("better-sqlite3");
const bansql = new SQLite(`./databases/bans.sqlite`);
const botsql = new SQLite(`./databases/bot.sqlite`);
module.exports = (client, error) => {
    console.error(error);
    client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `An Error occured: ${error}` });
}
/**
  * @INFO
  * Bot Coded by Tomato#6966 | https://discord.gg/FQGXbypRf8
  * @INFO
  * Work for Milrato Development | https://milrato.eu
  * @INFO
  * Please mention him / Milrato Development, when using this Code!
  * @INFO
*/
