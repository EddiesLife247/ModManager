const https = require('https');
module.exports = {
    name: "dog", //the command name for the Slash Command
    category: "Fun",
    usage: "dog",
    aliases: [],
    description: "Gets A random image of the internet", //the command description for Slash Command Overview
    cooldown: 15,
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    run: async (client, message, args) => {
        let url = "https://dog.ceo/api/breeds/image/random";
        https.get(url, (res) => {
            let body = "";
            res.on("data", (chunk) => {
                body += chunk;
            });
            res.on("end", () => {
                try {
                    let json = JSON.parse(body);
                    // do something with JSON
                    message.channel.send(json[`message`]);

                } catch (error) {
                    console.error(error.message);
                    message.reply(error.message);
                };
            });

        }).on("error", (error) => {
            console.error(error.message);
        });

    },
};