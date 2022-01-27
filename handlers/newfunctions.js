const {
    MessageEmbed,
    Collection
} = require("discord.js");
const config = require(`../botconfig/config.json`);
const ee = require(`../botconfig/embed.json`);
const settings = require(`../botconfig/settings.json`);
const Discord = require(`discord.js`);
//EXPORT ALL FUNCTIONS
module.exports.logMessage = logMessage;

function logMessage(client, result, guild, action) {
    // Log to the Main Log Channel
    console.log("log");
    client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n **${guild.name}** triggered event: **${action}** with result: **${result}**`);
}