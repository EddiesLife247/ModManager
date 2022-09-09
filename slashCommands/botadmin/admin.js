const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Discord = require('discord.js');
const SQLite = require("better-sqlite3");
const bansql = new SQLite(`./databases/bans.sqlite`);
const botsql = new SQLite(`./databases/bot.sqlite`);
const config = require(`../../configs/config.json`);
require('dotenv').config()
module.exports = {
    name: 'admin',
    description: 'Administration Commnads',
    cooldown: 3000,
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: 'ManageMessages', // permission required
    options: [
        {
            name: 'cmd',
            description: 'Admin Command',
            type: 3,
            required: true,
        },
    ],
    run: async (client, interaction) => {
        if(interaction.guild.id == '787871047139328000') {
            if(interaction.channel.id == '901905815810760764') {
                console.log(interaction.options.get('cmd'));
            } else {
                interaction.reply({content: `This command is reservered for Mod Manager Developers only. Sorry`, ephemeral: true});
            }
        } else {
            interaction.reply({content: `This command is reservered for Mod Manager Developers only. Sorry`, ephemeral: true});
        }
    }
}
function resetBot(channel) {
    // send channel a message that you're resetting bot [optional]
    channel.send('Resetting...')
    .then(msg => client.destroy())
    .then(() => client.login(process.env.TOKEN));
}