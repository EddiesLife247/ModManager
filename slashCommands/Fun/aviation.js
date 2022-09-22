const { ApplicationCommandType, ActionRowBuilder, ButtonBuilder, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const SQLite = require("better-sqlite3");
const sql = new SQLite(`./databases/scores.sqlite`);
const request = require('request');
const e = require('express');
var https = require('https');
module.exports = {
    name: 'aviation',
    description: "Aviation Commands!",
    type: ApplicationCommandType.ChatInput,
    cooldown: 3000,
    
    options: [
        {
			name: 'data',
			description: 'Get Aviation Data.',
			type: 1,
			options: [
				{
					name: 'taf',
					description: 'Get TAF reports for ICAO code',
					type: 3,
				},
                {
					name: 'metar',
					description: 'Get METAR reports for ICAO code',
					type: 3,
				},
            ]
        }
    ],
    run: async (client, interaction) => {
        interaction.deferReply();
        if (interaction.options.get('taf')) {
            var tafICAO = interaction.options.get('taf').value;
            try {
                console.log(`METAR for ${tafICAO}`);
                let argz = tafICAO.toUpperCase();
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
                            interaction.editReply({ embeds: [MetaEmbed] });
        
                        } catch (error) {
                            console.error(error.message);
                            interaction.editReply(error.message);
                        };
                    });
        
                }).on("error", (error) => {
                    console.error(error.message);
                });
            } catch (err) {
                client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `Error with TAF command: ${tafICAO} | ${err.message} | \`\`\` ${err.stack} \`\`\``});
            }
        }
        if (interaction.options.get('metar')) {
            var metarICAO = interaction.options.get('metar').value;
            try {
                console.log(`METAR for ${metarICAO}`);
                let argz = metarICAO.toUpperCase();
                console.log(argz);
                let url = `https://avwx.rest/api/metar/${argz}?options=info,translate,speech&token=I6DF0eFZdyAOfL6th2UVZsAWb_Cei_iAurasC8hVN7o`;
                console.log(url);
                https.get(url, (res) => {
                    let body = "";
                    res.on("data", (chunk) => {
                        body += chunk;
                    });
                    res.on("end", () => {
                        try {
                            let json = JSON.parse(body);
                            // do something with JSON
                            let MetaEmbed = new Discord.MessageEmbed()
                                .setTitle(`${argz} METAR INFORMATON`)
                                .addField('Name: ', `> ${json["info"]["name"]}`, true)
                                .addField('Type: ', `> ${json["info"]["type"]}`, true)
                                .addField('Web: ', `> ${json["info"]["website"]}`, true)
                                .addField('City: ', `>  ${json["info"]["city"]}`, true)
                                .addField('Country: ', `>  ${json["info"]["country"]}`, true)
                                .addField('Elevation in Feet: ', `>  ${json["info"]["elevation_ft"]}`, true)
                                .addField('Elevation in Meters: ', `>  ${json["info"]["elevation_m"]}`, true)
                                .addField('Clouds: ', `>  ${json["translate"]["clouds"]}`, true)
                                .addField('Weather: ', `>  ${json["translate"]["wx_codes"]}`, true)
                                .addField('Visibility: ', `>  ${json["translate"]["visibility"]}`, true)
                                .addField('Wind: ', `> ${json["translate"]["wind"]}`, true)
                                .addField('Temperature: ', `>  ${json["translate"]["temperature"]}`, true)
                                .addField('Altimeter: ', `>  ${json["altimeter"]["spoken"]}`, true)
                                .addField('Raw Data', `>  ${json["raw"]}`, true)
                                .setColor([0, 255, 0])
                            //.setURL(json[`info`][`website`]);
                            interaction.editReply({ embeds: [MetaEmbed], ephemeral: false });
        
                        } catch (error) {
                            console.error(error.message);
                            interaction.editReply(error.message);
                        };
                    });
        
                }).on("error", (error) => {
                    console.error(error.message);
                });
            } catch (err) {
                client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `Error with METAR command: ${err.message} | \`\`\` ${err.stack} \`\`\``});
            }
        }

    }
}