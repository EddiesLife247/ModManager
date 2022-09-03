const { EmbedBuilder, ApplicationCommandType, PermissionsBitField} = require('discord.js');
const Discord = require('discord.js');
const SQLite = require("better-sqlite3");
const botsql = new SQLite(`./databases/bot.sqlite`);
const bansql = new SQLite(`./databases/bans.sqlite`);
const config = require(`../../configs/config.json`);
module.exports = {
	name: 'botcheck',
    description: 'Check Bot Permissions for all features',
	cooldown: 3000,
	type: ApplicationCommandType.ChatInput,
	run: async (client, interaction) => {
        await interaction.deferReply();
        client.setup = botsql.prepare(`SELECT * FROM settings WHERE guildid = '${interaction.guild.id}'`);
        if (!client.setup.all().length) {
            return interaction.editReply("The bot has not been configured yet, run /config to setup the bot.");
        }
        if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.editReply("The bot has full administrator permissions. Does not require any further checks.");
        } else {
            var checksfailed;
            if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) {
                var sendMessages = true;
            } else {
                var sendMessages = false;
                checksfailed = false;
            }
            if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
                var ManageGuild = true;
            } else {
                var ManageGuild = false;
                checksfailed = false;
            }
            if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
                var ManageChannels = true;
            } else {
                var ManageChannels = false;
                checksfailed = false;
            }
            if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                var ManageMessages = true;
            } else {
                var ManageMessages = false;
                checksfailed = false;
            }
            if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                var ManageRoles = true;
            } else {
                var ManageRoles = false;
                checksfailed = false;
            }
            if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                var BanMembers = true;
            } else {
                var BanMembers = false;
                checksfailed = false;
            }
            if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
                var KickMembers = true;
            } else {
                var KickMembers = false;
                checksfailed = false;
            }
            if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
                var ModerateMembers = true;
            } else {
                var ModerateMembers = false;
                checksfailed = false;
            }
            if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.UseApplicationCommands)) {
                var UseApplicationCommands = true;
            } else {
                var UseApplicationCommands = false;
                checksfailed = false;
            }
            if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
                var ViewAuditLog = true;
            } else {
                var ViewAuditLog = false;
                checksfailed = false;
            }
            if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewChannel)) {
                var ViewChannel = true;
            } else {
                var ViewChannel = false;
                checksfailed = false;
            }
            if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ReadMessageHistory)) {
                var ReadMessageHistory = true;
            } else {
                var ReadMessageHistory = false;
                checksfailed = false;
            }
            if(checksfailed == false){
                interaction.editReply(`Checks Failed The following permissions are currently set for myself: \n View Audit Log: ${ViewAuditLog} \n View Channels: ${ViewChannel} \n Manage Guild: ${ManageGuild} \n Manage Channels: ${ManageChannels} \n Send Messages: ${sendMessages} \n Manage Messages: ${ManageMessages} \n Read Message History ${ReadMessageHistory} \n Timeout Members: ${ModerateMembers} \n Kick Members; ${KickMembers} \n Ban Members: ${BanMembers} \n Use Commands: ${UseApplicationCommands} \n \n **These MUST be set to TRUE for full operational use of this bot**`);
            } else {
                interaction.editReply(`Bot Permission Checks are completed, all required permissions are given.`);
            }
        }

    }
};