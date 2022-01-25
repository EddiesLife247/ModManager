module.exports = {
  name: "leave", //the command name for the Slash Command
  description: "Leave the server", //the command description for Slash Command Overview
  cooldown: 5,
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  run: async (client, interaction) => { // eslint-disable-line no-unused-vars
    await interaction.deferReply();
    if (!interaction.guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS))
      return await interaction.editReply("I do not have permission to kick members in this server.");
    await interaction.member.send("You requested to leave the server, if you change your mind you can rejoin at a later date.");
    await interaction.member.kick(`${interaction.member.displayName} wanted to leave.`);
    await interaction.editReply(`${interaction.member.displayName} left in a hurry!`);
  },
};