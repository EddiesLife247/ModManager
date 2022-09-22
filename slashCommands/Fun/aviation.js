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
                console.log(`TAF for ${tafICAO}`);
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
                            const MetaEmbed = new EmbedBuilder();
                            MetaEmbed.setColor("#0000ff");
                            MetaEmbed.setTitle(`**${argz}** - TAF INFORMATION`);
                            MetaEmbed.addFields(
                                { name: 'Name', value: `> ${json["info"]["name"]}`, inline: true },
                                { name: 'Type', value: `> ${json["info"]["type"]}`, inline: true },
                                { name: 'Web', value: `> ${json["info"]["website"]}`, inline: true },
                                { name: 'City', value: `> ${json["info"]["city"]}`, inline: true },
                                { name: 'Country', value: `> ${json["info"]["country"]}`, inline: true },
                                { name: 'Timestamp', value: `> ${json["info"]["timestamp"]}`, inline: true },
                                { name: 'Station', value: `> ${json["info"]["station"]}`, inline: true },
                                { name: 'Forecast', value: `> ${json["info"]["speech"]}`, inline: true },
                                { name: 'Raw Data', value: `> ${json["info"]["raw"]}`, inline: false },
                                { name: 'Sanitized Data', value: `> ${json["info"]["sanitized"]}` , inline: false},
                            );
                            MetaEmbed.setTimestamp();
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
                            const MetaEmbed = new EmbedBuilder();
                            MetaEmbed.setColor("#0000ff");
                            MetaEmbed.setTitle(`**${argz}** - TAF INFORMATION`);
                            MetaEmbed.addFields(
                                { name: 'Name', value: `> ${json["info"]["name"]}`, inline: true },
                                { name: 'Type', value: `> ${json["info"]["type"]}`, inline: true },
                                { name: 'Web', value: `> ${json["info"]["website"]}`, inline: true },
                                { name: 'City', value: `> ${json["info"]["city"]}`, inline: true },
                                { name: 'Country', value: `> ${json["info"]["country"]}`, inline: true },
                                { name: 'Elevation in Feet:', value: `> ${json["info"]["elevation_ft"]}`, inline: true },
                                { name: 'Elevation in Meters:', value: `> ${json["info"]["elevation_m"]}`, inline: true },
                                { name: 'Clouds', value: `> ${json["translate"]["clouds"]}`, inline: true },
                                { name: 'Weather', value: `> ${json["translate"]["wx_codes"]}`, inline: true },
                                { name: 'Visibility', value: `> ${json["translate"]["visibility"]}`, inline: true },
                                { name: 'Wind', value: `> ${json["translate"]["wind"]}`, inline: false },
                                { name: 'Temperature', value: `> ${json["translate"]["temperature"]}`, inline: false },
                                { name: 'Altimeter', value: `> ${json["altimeter"]["spoken"]}`, inline: false },
                                { name: 'Wind', value: `> ${json["raw"]}`, inline: false },
                            );
                            MetaEmbed.setTimestamp();
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