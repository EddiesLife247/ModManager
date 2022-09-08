const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Discord = require('discord.js');
const SQLite = require("better-sqlite3");
const bansql = new SQLite(`./databases/bans.sqlite`);
const botsql = new SQLite(`./databases/bot.sqlite`);
const config = require(`../../configs/config.json`);
module.exports = {
    name: 'bulkdelete',
    description: 'Bulk Delete multiple Messages in a channel',
    cooldown: 3000,
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: 'ManageMessages', // permission required
    options: [
        {
            name: 'amount',
            description: 'Amount of Messages to Delete (Max of 100)',
            type: 4,
            required: true,
            min_value: 1,
            max_value: 100,
        },
        {
            name: 'user',
            description: 'Delete by a user',
            type: 7,
            required: false,
            min_value: 1,
            max_value: 100,
        },
    ],
    run: async (client, interaction) => {
        const amount = interaction.options.getInteger('amount');
        if (interaction.options.get('user')) {
            const user = interaction.guild.members.cache.get(interaction.options.get('user').value);
            interaction.channel.messages.fetch({
                limit: 100,
            }).then((messages) => {
                if (user) {
                    const filterBy = user ? user.id : Client.user.id;
                    messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
                }
                interaction.channel.bulkDelete(messages).catch(error => console.log(error.stack));
                interaction.reply({content: `I have deleted ${amount} messages from this channel by user: ${user.username}.`, ephernal: true})

            })
        } else {
            interaction.channel.messages.fetch({
                limit: 100,
            }).then((messages) => {
                interaction.channel.bulkDelete(messages).catch(error => console.log(error.stack));
                interaction.reply({content: `I have deleted ${amount} messages from this channel.`, ephernal: true})

            });
        }
        console.log(amount);


    }
}