const https = require('https');
const animals = require('random-animals-api');
module.exports = {
  name: "lizard", //the command name for the Slash Command
  category: "Fun",
  usage: "lizard",
  aliases: [],
  description: "Gets A random image of the internet", //the command description for Slash Command Overview
  cooldown: 15,
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  run: async (client, message, args) => {
    animals.lizard()
      .then(url => message.channel.send(url))
      .catch((error) => console.error(error));

  }

};