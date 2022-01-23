const Discord = require('discord.js');
module.exports = {
  name: "urban", //the command name for the Slash Command
  category: "Fun",
  usage: "urban [query]",
  aliases: [],
  description: "Searches the Urban Dictionary", //the command description for Slash Command Overview
  cooldown: 15,
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  run: async (client, message, args) => {
    const request = require('request');

    const options = {
      method: 'GET',
      url: 'https://mashape-community-urban-dictionary.p.rapidapi.com/define',
      qs: { term: `${args}` },
      headers: {
        'x-rapidapi-host': 'mashape-community-urban-dictionary.p.rapidapi.com',
        'x-rapidapi-key': '6684e5a1aamshc38e4b0e7728e6cp14fe77jsn779996db7161',
        useQueryString: true
      }
    };

    request(options, function (error, response, body) {

      if (error) throw new Error(error);
      let json = JSON.parse(body);
      //console.log(json);

      let MetaEmbed = new Discord.MessageEmbed()
        .setTitle(`${args} URBAN DICTIONARY`)
        .addField('Defination: ', json[`list`][0][`definition`], true)
        .addField('Permalink: ', json[`list`][0][`permalink`], true)
        .addField('Author: ', json[`list`][0][`author`], true)
        .addField('Example: ', json[`list`][0][`example`], true)
        //.addField('Raw Data', json[`raw`], true)
        .setColor([0, 255, 0])
      message.channel.send({ embeds: [MetaEmbed] });


    });

  }
};