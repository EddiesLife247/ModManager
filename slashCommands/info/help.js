const { EmbedBuilder, ApplicationCommandType, PermissionsBitField } = require('discord.js');
const Discord = require('discord.js');
const SQLite = require("better-sqlite3");
const botsql = new SQLite(`./databases/bot.sqlite`);
const bansql = new SQLite(`./databases/bans.sqlite`);
const config = require(`../../configs/config.json`);
module.exports = {
    name: 'help',
    description: 'Helpful information about the bot',
    cooldown: 3000,
    type: ApplicationCommandType.ChatInput,
    options: [
		{
			name: 'topic',
			description: 'What would you like to know about?.',
            type: 3,
            required: true,
            choices: [
                { name: "reactionroles", value: "Reaction Roles"},
                { name: "funcmds", value: "Fun Commands"},
                { name: "botcmds", value: "Bot Commands"},
                { name: "modcmds", value: "Moderator Commands"},
                { name: "logchan", value: "Log Channels"},
            ],
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ephemeral: true });
        const chosenString = interaction.options.getString("topic");
        console.log(chosenString);
        if (chosenString === 'Reaction Roles') {
            const embed = new EmbedBuilder();
            embed.setColor("#0000ff");
            embed.setTitle(`**Help Guides** - Reaction Roles`);
            embed.setDescription(`If you require any extra support, click the link above to join the support server. \n Required Options: () Optional Options []`);
            embed.setTimestamp();
            embed.setURL(`https://discord.gg/ynUy2Sfx9U`);
            embed.addFields(
                { name: 'add (role) (channel)', value: `Add's a reaction role to a specifc channel with the chosen role, the role name will be displayed as an option` },
                { name: 'del (role) (channel)', value: `Remove's a reaction role from the server.` },
            );
            return interaction.editReply({ content: `Here is the information about: ${chosenString}`, embeds: [embed], ephemeral: true });
        }
        else if (chosenString === 'Fun Commands') {
            const embed = new EmbedBuilder();
            embed.setColor("#0000ff");
            embed.setTitle(`**Help Guides** - Fun Commands`);
            embed.setDescription(`If you require any extra support, click the link above to join the support server. \n Required Options: () Optional Options []`);
            embed.setTimestamp();
            embed.setURL(`https://discord.gg/ynUy2Sfx9U`);
            embed.addFields(
                { name: 'picture (category)', value: `Return's a picture to the chat of the chosen category` },
                { name: 'joke', value: `Returns a random joke.` },
                { name: 'trivia', value: `Returns a trivia question, reveal the answer by clicking the spoiler.` },
                { name: 'leave', value: `Leave the server by a fun way, with a kick.` },
            );
            return interaction.editReply({ content: `Here is the information about: ${chosenString}`, embeds: [embed], ephemeral: true });
        }
        else if (chosenString === 'Bot Commands') {
            const embed = new EmbedBuilder();
            embed.setColor("#0000ff");
            embed.setTitle(`**Help Guides** - Bot Commands`);
            embed.setDescription(`If you require any extra support, click the link above to join the support server. \n Required Options: () Optional Options []`);
            embed.setTimestamp();
            embed.setURL(`https://discord.gg/ynUy2Sfx9U`);
            embed.addFields(
                { name: 'botinfo', value: `Return's information about myself` },
                { name: 'botcheck', value: `Checks the permissions of the bot on your server, use this for troubleshooting errors` },
                { name: 'help', value: `Returns this help menu and options` },
                { name: 'config (option)', value: `Configure the settings of the bot for the server` },
            );
            return interaction.editReply({ content: `Here is the information about: ${chosenString}`, embeds: [embed], ephemeral: true });
        }
        else if (chosenString === 'Moderator Commands') {
            const embed = new EmbedBuilder();
            embed.setColor("#0000ff");
            embed.setTitle(`**Help Guides** - Moderator Commands`);
            embed.setDescription(`If you require any extra support, click the link above to join the support server. \n Required Options: () Optional Options []`);
            embed.setTimestamp();
            embed.setURL(`https://discord.gg/ynUy2Sfx9U`);
            embed.addFields(
                { name: 'warn *moderate members permission required', value: `Right click a user and choose Apps > Warn - A warning reason dialog will show enter, and this will be sent to the user and logged to the database` },
                { name: 'kick *kick members permission required', value: `Right click a user and choose Apps > kick - A reason dialog will show enter the reason why you are kicking the user, it will be added to our database` },
                { name: 'ban *ban members permission required', value: `Right click a user and choose Apps > Ban - A reason dialog will show enter the reason why you are kicking the user, it will be added to our database` },
                { name: 'report *everyone can use this', value: `Right click a message and click Apps > Report, this reports to the configured moderator staff channel` },
                { name: 'role (user) (role) *manage roles permission required', value: `Assigns a role to a user` },
                { name: 'userinfo *moderate members permission required', value: `Right click a user and choose Apps > User Info - This will display the users punishment database history.` },
            );
            return interaction.editReply({ content: `Here is the information about: ${chosenString}`, embeds: [embed], ephemeral: true });
        }
        else if (chosenString === 'Log Channels') {
            const embed = new EmbedBuilder();
            embed.setColor("#0000ff");
            embed.setTitle(`**Help Guides** - Log Channels`);
            embed.setDescription(`If you require any extra support, click the link above to join the support server. \n Required Options: () Optional Options []`);
            embed.setTimestamp();
            embed.setURL(`https://discord.gg/ynUy2Sfx9U`);
            embed.addFields(
                { name: 'Log Channel Notices', value: `Get Audit Logs to a channel in your server using /config logchannel (channel), The bot must have permission to view audit logs`},
            );
            return interaction.editReply({ content: `Here is the information about: ${chosenString}`, embeds: [embed], ephemeral: true });
        }
        
    }
};