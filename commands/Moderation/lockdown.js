const Discord = require('discord.js')
module.exports = {
    name: "lockdown", //the command name for the Slash Command
    category: "Moderation",
    usage: "lockdown [all]",
    aliases: [],
    description: "WARNING: This changes the permissions for the EVERNYONE role, use wisely!", //the command description for Slash Command Overview
    cooldown: 15,
    memberpermissions: ["MANAGE_GUILD"],
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    run: async (client, message, args) => {
        client.features.ensure(message.guild.id, {
            music: true,
            logs: true,
            reactionroles: true,
            moderation: true,
            fun: true,
            youtube: false,
            support: true,
            points: true,
        });
        if (client.features.get(message.guild.id, "moderation") == false) {
            return;
        } else {
            if (args[0] == "on") {
                message.channel.permissionOverwrites.create(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
                message.reply("Channel Locked!");
            } else if (args[0] == "off") {
                message.channel.permissionOverwrites.create(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
                message.reply("Channel UnLocked!");
            } else if (args[0] == "all") {
                if (args[1] == "on") {
                    message.reply("LOCKING DOWN ALL CHANNELS!");
                    //Get all channels in guild.
                    await message.channel.guild.channels.cache.forEach(function (i) {
                        //console.log(i);
                        i.permissionOverwrites.create(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
                    });
                    message.reply("LOCKED SERVER!");
                } else if (args[1] == "off") {
                    message.reply("Removing Lockdown on all Channels!");
                    //Get all channels in guild.
                    await message.channel.guild.channels.cache.forEach(function (i) {
                        //console.log(i);
                        i.permissionOverwrites.create(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
                    });
                    message.reply("UNLOCKED SERVER!");
                }
            }
        }
    }

};