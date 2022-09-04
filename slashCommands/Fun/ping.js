module.exports = {
  name: "ping", //the command name for the Slash Command
  description: "Pings the bot", //the command description for Slash Command Overview
  cooldown: 5,
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  run: async (client, interaction) => { // eslint-disable-line no-unused-vars
    const SQLite = require("better-sqlite3");
    const botsql = new SQLite(`./databases/bot.sqlite`);
    client.hidefuncmds = botsql.prepare(`SELECT hidefuncmds FROM settings WHERE guildid = '${interaction.guild.id}'`);
    if (client.hidefuncmds.get().hidefuncmds == '0' || client.hidefuncmds.get().hidefuncmds == '1') {
      hidefuncmds = client.hidefuncmds.get().hidefuncmds;
      if (hidefuncmds == "1") {
        await interaction.deferReply({ephemeral: true });
        const reply = await interaction.editReply({content: `Ping?`,  ephemeral: true });
        await interaction.editReply({ content: `Pong! Latency is ${reply.createdTimestamp - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms.`, ephemeral: true });
      } else {
        await interaction.deferReply({ephemeral: true });
        const reply = await interaction.editReply({content: `Ping?`,  ephemeral: false });
        await interaction.editReply({ content: `Pong! Latency is ${reply.createdTimestamp - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms.`, ephemeral: false });
      }
    } else {
      interaction.reply({ content: `Sorry, This guild is not setup yet, as a staff member to run /config`, ephemeral: true });
  }
  },
};
