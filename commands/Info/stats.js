const { version } = require("discord.js");
const { codeBlock } = require("@discordjs/builders");
const { DurationFormatter } = require("@sapphire/time-utilities");
const durationFormatter = new DurationFormatter();

module.exports = {
  name: "stats",
  category: "Info",
  description: "Gives some useful bot statistics (EVERYONE)",
  usage: "stats",
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User",
  async execute(client, message, args) {
    try {
    const duration = durationFormatter.format(client.uptime);
    const stats = codeBlock("asciidoc", `= STATISTICS =
  • Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
  • Uptime     :: ${duration}
  • Users      :: ${client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b).toLocaleString()}
  • Servers    :: ${client.guilds.cache.size.toLocaleString()}
  • Channels   :: ${client.channels.cache.size.toLocaleString()}
  • Discord.js :: v${version}
  • Node       :: ${process.version}`);
    message.channel.send(stats);
    } catch (err) {
      const { logMessage } = require(`../../handlers/newfunctions`);
      logMessage(client, `error`, message.guild, `Error with INFO command: ${err.message} | ${err.stack}`);
    }
  }

};
