const {
    MessageEmbed,
    Collection
} = require("discord.js");
const config = require(`../botconfig/config.json`);
const ee = require(`../botconfig/embed.json`);
const settings = require(`../botconfig/settings.json`);
const Discord = require(`discord.js`);
const SQLite = require("better-sqlite3");
const bansql = new SQLite(`./databases/bans.sqlite`);

//EXPORT ALL FUNCTIONS
module.exports.logMessage = logMessage;
module.exports.refreshPunishDB = refreshPunishDB;

function logMessage(client, result, guild, action) {
    // Log to the Main Log Channel
    console.log(`\n \n **${guild.name}** triggered event: **${action}** with result: **${result}**`);
    client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n **${guild.name}** triggered event: **${action}** with result: **${result}**`);
}
function refreshPunishDB(client){
    const top10 = bansql.prepare("SELECT * FROM 'bans'").all();
    const embed = new Discord.MessageEmbed()
    .setColor("#00ff00")
    .setTitle("**Moderation** - Punishment Database Update")
    .setTimestamp();
    var gupdate = 0;
    var pupdate = 0;
    var lupdate = 0;
    var kupdate = 0;
    var wupdate = 0;
    var update = 0;
    var expired = 0;
    var gexpired = 0;
    var pexpired = 0;
    var lexpired = 0;
    var kexpired = 0;
    var wexpired = 0;
    for (const data of top10) {
      // Check each ban against the current data.
      var lengthleft = data.length - 1;
      if (lengthleft == 0) {
        bansql.prepare(`DELETE FROM 'bans' WHERE ID = '${data.id}'`).run()
        console.log(data);
        if(data.approved == "GLOBAL"){
            var gexpired = gexpired + 1;
            }
            if(data.approved == "PENDING"){
                var pexpired = pexpired + 1;
                }
                if(data.approved == "LOCAL"){
                    var lexpired = lexpired + 1;
                    }
                    if(data.approved == "KICK"){
                        var kexpired = kexpired + 1;
                        }
                        if(data.approved == "WARNING"){
                            var wexpired = wexpired + 1;
                            }
      } else {
          
        bansql.prepare(`UPDATE 'bans' SET length = '${lengthleft}' WHERE ID = '${data.id}'`).run()
        if(data.approved == "GLOBAL"){
        var gupdate = gupdate + 1;
        }
        if(data.approved == "PENDING"){
            var pupdate = pupdate + 1;
            }
            if(data.approved == "LOCAL"){
                var lupdate = lupdate + 1;
                }
                if(data.approved == "KICK"){
                    var kupdate = kupdate + 1;
                    }
                    if(data.approved == "WARNING"){
                        var wupdate = wupdate + 1;
                        }
      }
    }
    var expired = gexpired + pexpired + lexpired + kexpired + wexpired;
    var update = gupdate + pupdate + lupdate + kupdate + wupdate;
    var total = expired + update;
    embed.addField(`Total Expired Warnings`, `${wexpired}`, true);
    embed.addField(`Total Expired Kicks`, `${kexpired}`, true);
    embed.addField(`Total Updated **PENDING**`, `${pexpired}`, true);
    embed.addField(`Total Expired Local Bans`, `${lexpired}`, true);
    embed.addField(`Total Expired Global Bans`, `${gexpired}`, true);
    embed.addField(`\u200B`, `\u200B`);
    embed.addField(`Total Updated Warnings`, `${wupdate}`, true);
    embed.addField(`Total Updated Kicks`, `${kupdate}`, true);
    embed.addField(`Total Updated **PENDING**`, `${pupdate}`, true);
    embed.addField(`Total Updated Local Bans`, `${lupdate}`, true);
    embed.addField(`Total Updated Global Bans`, `${gupdate}`, true);
    embed.addField(`\u200B`, `\u200B`);
    embed.addField(`Total Updated Records`, `${update}`, true);
    embed.addField(`Total Expired Records`, `${expired}`, true);
    embed.addField(`Total Records`, `${total}`);
    client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send({ embeds: [embed] });
    client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ embeds: [embed] });
}