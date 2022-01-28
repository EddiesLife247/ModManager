//here the event starts
const config = require("../../botconfig/config.json")
const { change_status } = require("../../handlers/functions");
const SQLite = require("better-sqlite3");
const sql = new SQLite(`./databases/scores.sqlite`);

module.exports = client => {
  const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get();
  if (!table['count(*)']) {
    // If the table isn't there, create it and setup the database correctly.
    sql.prepare("CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER);").run();
    // Ensure that the "id" row is always unique and indexed.
    sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run();
    sql.pragma("synchronous = 1");
    sql.pragma("journal_mode = wal");
  }
  const rrsql = new SQLite(`./databases/rr.sqlite`);
  const rrtable = rrsql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'rrtable';").get();
  if (!rrtable['count(*)']) {
    // If the table isn't there, create it and setup the database correctly.
    rrsql.prepare("CREATE TABLE rrtable (id TEXT PRIMARY KEY, emoji TEXT, guild TEXT, role TEXT, messageid TEXT, channel TEXT);").run();
    // Ensure that the "id" row is always unique and indexed.
    rrsql.prepare("CREATE UNIQUE INDEX idx_rrtable_id ON rrtable (id);").run();
    rrsql.pragma("synchronous = 1");
    rrsql.pragma("journal_mode = wal");
  }
  /* Adding Feature options and ability for the future to make items subscription enabled */
  const featuresql = new SQLite(`./databases/features.sqlite`);
  const featuretable = featuresql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'features';").get();
  if (!featuretable['count(*)']) {
    // If the table isn't there, create it and setup the database correctly.
    featuresql.prepare("CREATE TABLE features (id TEXT PRIMARY KEY, feature TEXT, guild TEXT, premium TEXT, status TEXT);").run();
    // Ensure that the "id" row is always unique and indexed.
    featuresql.prepare("CREATE UNIQUE INDEX idx_features_id ON features (id);").run();
    featuresql.pragma("synchronous = 1");
    featuresql.pragma("journal_mode = wal");
  }
  // END NEW FEATURE
  
  const supsql = new SQLite(`./databases/support.sqlite`);
  const suptable = supsql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'tickets';").get();
  if (!suptable['count(*)']) {
    // If the table isn't there, create it and setup the database correctly.
    supsql.prepare("CREATE TABLE tickets (id TEXT PRIMARY KEY, user TEXT, guild TEXT, initmsg TEXT, subject TEXT, status TEXT);").run();
    // Ensure that the "id" row is always unique and indexed.
    supsql.prepare("CREATE UNIQUE INDEX idx_tickets_id ON tickets (id);").run();
    supsql.pragma("synchronous = 1");
    supsql.pragma("journal_mode = wal");
  }
  const bansql = new SQLite(`./databases/bans.sqlite`);
  const bantable = bansql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'bans';").get();
  if (!bantable['count(*)']) {
    // If the table isn't there, create it and setup the database correctly.
    bansql.prepare("CREATE TABLE bans (id TEXT PRIMARY KEY, user TEXT, guild TEXT, reason TEXT, approved TEXT, appealed TEXT, date TEXT, length INTEGER);").run();
    // Ensure that the "id" row is always unique and indexed.
    bansql.prepare("CREATE UNIQUE INDEX idx_bans_id ON bans (id);").run();
    bansql.pragma("synchronous = 1");
    bansql.pragma("journal_mode = wal");
  }
  const masql = new SQLite(`./databases/modactions.sqlite`);
  const matable = masql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'modactions';").get();
  if (!matable['count(*)']) {
    // If the table isn't there, create it and setup the database correctly.
    masql.prepare("CREATE TABLE modactions (id TEXT PRIMARY KEY, user TEXT, guild TEXT, action TEXT, type TEXT);").run();
    // Ensure that the "id" row is always unique and indexed.
    masql.prepare("CREATE UNIQUE INDEX idx_modactions_id ON modactions (id);").run();
    masql.pragma("synchronous = 1");
    masql.pragma("journal_mode = wal");
  }
  const botsql = new SQLite(`./databases/bot.sqlite`);
  const bottable = botsql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'guildadmin';").get();
  if (!bottable['count(*)']) {
    // If the table isn't there, create it and setup the database correctly.
    botsql.prepare("CREATE TABLE guildadmin (id TEXT PRIMARY KEY, account TEXT, reason TEXT, type TEXT);").run();
    // Ensure that the "id" row is always unique and indexed.
    botsql.prepare("CREATE UNIQUE INDEX idx_botadmin_id ON guildadmin (id);").run();
    botsql.pragma("synchronous = 1");
    botsql.pragma("journal_mode = wal");
  }
  const twitchsql = new SQLite(`./databases/twitch.sqlite`);
  const twitchtable = twitchsql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'twitch';").get();
  if (!twitchtable['count(*)']) {
    // If the table isn't there, create it and setup the database correctly.
    twitchsql.prepare("CREATE TABLE twitch (id TEXT PRIMARY KEY, guild TEXT, twitch TEXT, invite TEXT, vip TEXT);").run();
    // Ensure that the "id" row is always unique and indexed.
    twitchsql.prepare("CREATE UNIQUE INDEX idx_twitch_id ON twitch (id);").run();
    twitchsql.pragma("synchronous = 1");
    twitchsql.pragma("journal_mode = wal");
  }
  const invsql = new SQLite(`./databases/invites.sqlite`);
  const invtable = invsql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'invites';").get();
  if (!invtable['count(*)']) {
    // If the table isn't there, create it and setup the database correctly.
    invsql.prepare("CREATE TABLE invites (id TEXT PRIMARY KEY, guild TEXT, invitecode TEXT, inviteuses INTEGER);").run();
    // Ensure that the "id" row is always unique and indexed.
    invsql.prepare("CREATE UNIQUE INDEX idx_invites_id ON invites (id);").run();
    invsql.pragma("synchronous = 1");
    invsql.pragma("journal_mode = wal");
  }
  // Initialize the invite cache
  // A pretty useful method to create a delay without blocking the whole script.
  //SETTING ALL GUILD DATA FOR THE DJ ONLY COMMANDS for the DEFAULT
  //client.guilds.cache.forEach(guild=>client.settings.set(guild.id, ["autoplay", "clearqueue", "forward", "loop", "jump", "loopqueue", "loopsong", "move", "pause", "resume", "removetrack", "removedupe", "restart", "rewind", "seek", "shuffle", "skip", "stop", "volume"], "djonlycmds"))
  try {
    try {
      client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ** BOT ONLINE **`);
      const stringlength = 69;
      console.log("\n")
      console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.brightGreen)
      console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen)
      console.log(`     ┃ `.bold.brightGreen + `Discord Bot is online!`.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length - `Discord Bot is online!`.length) + "┃".bold.brightGreen)
      console.log(`     ┃ `.bold.brightGreen + ` /--/ ${client.user.tag} /--/ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length - ` /--/ ${client.user.tag} /--/ `.length) + "┃".bold.brightGreen)
      console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen)
      console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.brightGreen)
    } catch { /* */ }
    change_status(client);
    //loop through the status per each 10 minutes
    setInterval(() => {
      change_status(client);
    }, 15 * 1000);

  } catch (e) {
    console.log(String(e.stack).grey.italic.dim.bgRed)
  }

}

/**
  * @INFO
  * Bot Coded by Tomato#6966 | https://discord.gg/FQGXbypRf8
  * @INFO
  * Work for Milrato Development | https://milrato.eu
  * @INFO
  * Please mention him / Milrato Development, when using this Code!
  * @INFO
*/
