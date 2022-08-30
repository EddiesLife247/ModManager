const { ApplicationCommandType, ActionRowBuilder, ButtonBuilder, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const SQLite = require("better-sqlite3");
const sql = new SQLite(`./databases/scores.sqlite`);
const request = require('request');
module.exports = {
    name: 'trivia',
    description: "Trivia Time!",
    type: ApplicationCommandType.ChatInput,
    cooldown: 3000,
    run: async (client, interaction) => {
        await interaction.deferReply();
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
                    interaction.editReply(`Random Question: :${json[0]['question']} \n \n To see the answer click: ||${json[0]['answer']}||`);
                });
    
    }
};
