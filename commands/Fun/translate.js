const Discord = require('discord.js');
module.exports = {
  name: "translate", //the command name for the Slash Command
  category: "Fun",
  usage: "translate [la] [query]",
  aliases: [],
  description: "Translates English to Language [la]", //the command description for Slash Command Overview
  cooldown: 15,
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  run: async (client, message, args) => {
    const request = require('request');
    var transLate = args.slice(1).join(" ");
    const options = {
      method: 'POST',
      url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'accept-encoding': 'application/gzip',
        'x-rapidapi-host': 'google-translate1.p.rapidapi.com',
        'x-rapidapi-key': '6684e5a1aamshc38e4b0e7728e6cp14fe77jsn779996db7161',
        useQueryString: true
      },
      form: { q: `${transLate}`, target: `${args[0]}`, source: 'en' }
    };

    if (args[0] == "") return message.reply("You must choose a language translate <la> <query>");
    if (args.slice(1).join(" ") == "") return message.reply("You must choose some text to translate. translate <la> <query>");
    request(options, function (error, response, body) {

      if (error) throw new Error(error);
      let json = JSON.parse(body);
      //console.log(json['data']['translations'][0]['translatedText']);

      let MetaEmbed = new Discord.MessageEmbed()
        .setTitle(`Google Translate`)
        .addField('Language: ', args[0], true)
        .addField('From: ', transLate, true)
        .addField('Translation: ', `${json['data']['translations'][0]['translatedText']}`, true)
        //.addField('Example: ', json[`list`][0][`example`], true)
        //.addField('Raw Data', json[`raw`], true)
        .setColor([0, 255, 0])
      message.channel.send({ embeds: [MetaEmbed] });


    });

  }
};