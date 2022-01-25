const {Client, ContextMenuInteraction } = requre("discord.js");
module.exports = {
    name: "getcontent", //the command name for the Slash Command
    type: "USER",
    /*
     * @param {ContextMenuInteraction} interaction
    */
    run: async (client, interaction, args) => { // eslint-disable-line no-unused-vars
        interaction.followUp({ content: "you clicked it!"});
    },
  };