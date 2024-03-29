const jokes = [
  'I went to a street where the houses were numbered 8k, 16k, 32k, 64k, 128k, 256k and 512k. ||It was a trip down Memory Lane.||',
  '“Debugging” is like being the detective in a crime drama where you are also the murderer.',
  'The best thing about a Boolean is that even if you are wrong, you are only off by a bit.',
  'A programmer puts two glasses on his bedside table before going to sleep. || A full one, in case he gets thirsty, and an empty one, in case he doesn’t. ||',
  'If you listen to a UNIX shell, can you hear the C?',
  'Why do Java programmers have to wear glasses? Because they don’t C#.',
  'What sits on your shoulder and says “Pieces of 7! Pieces of 7!”? || A Parroty Error. ||',
  'When Apple employees die, does their life HTML5 in front of their eyes?',
  'Without requirements or design, programming is the art of adding bugs to an empty text file.',
  'Before software can be reusable it first has to be usable.',
  'The best method for accelerating a computer is the one that boosts it by 9.8 m/s2.',
  'I think Microsoft named .Net so it wouldn’t show up in a Unix directory listing.',
  'There are two ways to write error-free programs; only the third one works.',
];
module.exports = {
  name: "joke", //the command name for the Slash Command
  description: "Shows a random Joke", //the command description for Slash Command Overview
  cooldown: 5,
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  run: async (client, interaction) => { // eslint-disable-line no-unused-vars
    const SQLite = require("better-sqlite3");
    const botsql = new SQLite(`./databases/bot.sqlite`);
    client.hidefuncmds = botsql.prepare(`SELECT hidefuncmds FROM settings WHERE guildid = '${interaction.guild.id}'`);
    console.log(client.hidefuncmds.get().hidefuncmds);
        if (client.hidefuncmds.get().hidefuncmds == '0' || client.hidefuncmds.get().hidefuncmds == '1') {
      hidefuncmds = client.hidefuncmds.get().hidefuncmds;
      if (hidefuncmds == "1") {
        await interaction.deferReply({ephemeral: true });
        const reply = await interaction.editReply({ content: `Joke Time!`, ephemeral: true });
        await interaction.editReply({ content: jokes[Math.floor(Math.random() * jokes.length)], ephemeral: true });
      } else {
        await interaction.deferReply({ephemeral: false });
        const reply = await interaction.editReply({ content: `Joke Time!`, ephemeral: false });
        await interaction.editReply({ content: jokes[Math.floor(Math.random() * jokes.length)], ephemeral: false });
      }
    } else {
      interaction.reply({ content: `Sorry, This guild is not setup yet, as a staff member to run /config`, ephemeral: true });
  }
  },
};