const { ApplicationCommandType, ActionRowBuilder, ButtonBuilder, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const SQLite = require("better-sqlite3");
const sql = new SQLite(`./databases/scores.sqlite`);
const request = require('request');
const e = require('express');
module.exports = {
    name: 'trivia',
    description: "Trivia Time!",
    type: ApplicationCommandType.ChatInput,
    cooldown: 3000,
    run: async (client, interaction) => {
        const SQLite = require("better-sqlite3");
        const botsql = new SQLite(`./databases/bot.sqlite`);
        client.hidefuncmds = botsql.prepare(`SELECT hidefuncmds FROM settings WHERE guildid = '${interaction.guild.id}'`);
        if (client.hidefuncmds.get().hidefuncmds) {
            hidefuncmds = client.hidefuncmds.get().hidefuncmds;
            if (hidefuncmds == "1") {
                await interaction.deferReply({ ephemeral: true });
            } else {
                await interaction.deferReply({ ephemeral: false });
            }
            const options = {
                method: 'GET',
                url: 'https://trivia-by-api-ninjas.p.rapidapi.com/v1/trivia',
                headers: {
                    'x-rapidapi-host': 'trivia-by-api-ninjas.p.rapidapi.com',
                    'x-rapidapi-key': 'e0980a2f6emshbf207eddf0a785ep128763jsn5fc56351a0d0',
                    useQueryString: true
                }
            };

            request(options, function (error, response, body) {
                //if (error) throw new Error(error);
                let json = JSON.parse(body);
                //console.log(json);
                if (hidefuncmds == "1") {
                    interaction.editReply({ content: `Random Question: :${json[0]['question']} \n \n To see the answer click: ||${json[0]['answer']}||`, ephemeral: true });
                } else {
                    interaction.editReply(`Random Question: :${json[0]['question']} \n \n To see the answer click: ||${json[0]['answer']}||`);
                }
            });
        } else {
            interaction.reply({ content: `Sorry, This guild is not setup yet, as a staff member to run /config`, ephemeral: true });
        }

    }
};
