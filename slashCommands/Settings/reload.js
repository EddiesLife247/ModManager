const {
    MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
    name: "reload", //the command name for execution & for helpcmd [OPTIONAL]
    cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
    description: "Update Slash Commands for Guild", //the command description for helpcmd [OPTIONAL]
    memberpermissions: ["MANAGE_GUILD "], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [],
    run: async (client, interaction) => {
        await interaction.guild.commands.set([]).catch((e) => { });
        interaction.guild.commands.set(allCommands)
            .then(slashCommandsData => {
                client.slashCommandsData = slashCommandsData;
                console.log(`${slashCommandsData.size} slashCommands ${`(With ${slashCommandsData.map(d => d.options).flat().length} Subcommands)`.green} Loaded for: ${`${guild.name}`.underline}`.brightGreen);
                interaction.reply("Slash Commands Reloaded!");
            }).catch((e) => { console.log(e) });

    }
}