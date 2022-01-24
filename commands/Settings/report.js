var createIssue = require('github-create-issue');
const Discord = require("discord.js");
module.exports = {
  name: "report", //the command name for the Slash Command
  category: "Settings",
  usage: "report [message to bot staff]",
  aliases: [],
  description: "Reports issue with Mod Manager", //the command description for Slash Command Overview
  cooldown: 15,
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  run: async (client, message, args) => {
    let MSG = message.content.split(" ");
    let Query = MSG.slice(1).join("+");
    let QueryD = MSG.slice(1).join(" ");
    //console.log(message.author);
    var opts = {
      'token': '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',
      'body': `${QueryD}` + `\n \n **by User:**  ${message.author.id}`
    };
    createIssue('Manumission247/ModManager', `User Reported Error by User ID: ${message.author.id}`, opts, clbk);

    function clbk(error, issue, info) {
      // Check for rate limit information...
      if (info) {
        //console.error( 'Limit: %d', info.limit );
        //console.error( 'Remaining: %d', info.remaining );
        //console.error( 'Reset: %s', (new Date( info.reset*1000 )).toISOString() );

      }
      if (error) {
        console.log(error.message);
        message.reply("There was an issue with your request!");
        return;
      }
      //console.log(issue);
      var obj = JSON.stringify(issue);

      //console.log(  );
      // returns <issue_data>
      let ErrorEmbed = new Discord.MessageEmbed()
        .setTitle(`A User Reported A Bug`)
        .addField('Issue: ', `${QueryD}`, true)
        .addField('Server Name: ', `${message.guild.name}`, true)
        .addField('Issue Owner: ', `${message.author.tag}`, true)
        .setColor([255, 0, 0])
        .setTimestamp();
      client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send({ embeds: [ErrorEmbed] });

      var stringify = obj;
      //console.log(stringify);
      message.reply(`Your issue has been logged to github! Visit: https://github.com/manumission247/ModManager`);
      /*console.log(stringify);
      for (var i = 0; i < stringify.length; i++) {
      
      }
      */
    }
  }
};