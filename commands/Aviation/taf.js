var https = require('https');
const Discord = require('discord.js');
module.exports = {
    name: "taf", //the command name for the Slash Command
    category: "Aviation",
    usage: "taf ICAO",
    aliases: ["ta"],
    description: "Gets Weather TAF Information", //the command description for Slash Command Overview
    cooldown: 15,
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    run: async (client, message, args) => {
        console.log(`METAR for ${args} by ${message.author.tag}`);
        let argz = args.map(e => e.toUpperCase());
        let url = `https://avwx.rest/api/taf/${argz}?options=info,translate,speech&token=I6DF0eFZdyAOfL6th2UVZsAWb_Cei_iAurasC8hVN7o`;
        console.log(url);
        https.get(url, (res) => {
            let body = "";
            res.on("data", (chunk) => {
                body += chunk;
            });
            res.on("end", () => {
                try {
                    let json = JSON.parse(body);
                    //console.log(json);
                    // do something with JSON
                    let MetaEmbed = new Discord.MessageEmbed()
                        .setTitle(`${argz} TAF INFORMATON`)
                        .addField('Name: ', `> ${json["info"]["name"]}`, true)
                        .addField('Type: ', `> ${json["info"]["type"]}`, true)
                        .addField('Web: ', `>  ${json["info"]["website"]}`, true)
                        .addField('City: ', `> ${json["info"]["city"]}`, true)
                        .addField('Country: ', `> ${json["info"]["country"]}`, true)
                        .addField('Timestamp: ', `> ${json["meta"]["timestamp"]}`, true)
                        .addField('Station: ', `>  ${json["station"]}`, true)
                        .addField('Forecast: ', `> ${json["speech"]}`, true)
                        .addField('Raw Data', `>  ${json["raw"]}`, false)
                        .addField('Sanitized Data', `> ${json["sanitized"]}`, false)
                        .setColor([0, 255, 0])
                    //.setURL(json[`info`][`website`]);
                    message.channel.send({ embeds: [MetaEmbed] });

                } catch (error) {
                    console.error(error.message);
                    message.reply(error.message);
                };
            });

        }).on("error", (error) => {
            console.error(error.message);
        });
    }
};