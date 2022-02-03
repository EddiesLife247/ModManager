// This will check if the node version you are running is the required
// Node version, if it isn't it will throw the following error to inform
// you.
if (Number(process.version.slice(1).split(".")[0]) < 16) throw new Error(" ERROR Node 16.x or higher is required. Update Node on your system.");
const Discord = require("discord.js");
const config = require(`./botconfig/config.json`);
const settings = require(`./botconfig/settings.json`);
const filters = require(`./botconfig/filters.json`);
const colors = require("colors");
const cron = require('node-cron');
const Enmap = require("enmap");
const libsodium = require("libsodium-wrappers");
const ffmpeg = require("ffmpeg-static");
const voice = require("@discordjs/voice");
const DisTube = require("distube").default;
const https = require('https-proxy-agent');

const client = new Discord.Client({
  //fetchAllMembers: false,
  //restTimeOffset: 0,
  //restWsBridgetimeout: 100,
  shards: "auto",
  //shardCount: 5,
  allowedMentions: {
    parse: [],
    repliedUser: false,
  },
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_BANS,
    Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
    Discord.Intents.FLAGS.GUILD_WEBHOOKS,
    Discord.Intents.FLAGS.GUILD_INVITES,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING
  ],
  presence: {
    activity: {
      name: `?help`,
      type: "PLAYING",
    },
    status: "online"
  }
});
//BOT CODED BY: Tomato#6966
//DO NOT SHARE WITHOUT CREDITS!
//const proxy = 'http://123.123.123.123:8080';
//const agent = https(proxy);
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
let spotifyoptions = {
  parallel: true,
  emitEventsAfterFetching: true,
}
if (config.spotify_api.enabled) {
  spotifyoptions.api = {
    clientId: config.spotify_api.clientId,
    clientSecret: config.spotify_api.clientSecret,
  }
}
client.distube = new DisTube(client, {
  emitNewSongOnly: false,
  leaveOnEmpty: true,
  leaveOnFinish: true,
  leaveOnStop: true,
  savePreviousSongs: true,
  emitAddSongWhenCreatingQueue: false,
  //emitAddListWhenCreatingQueue: false,
  searchSongs: 0,
  youtubeCookie: config.youtubeCookie,     //Comment this line if you dont want to use a youtube Cookie 
  nsfw: true, //Set it to false if u want to disable nsfw songs
  emptyCooldown: 25,
  ytdlOptions: {
    //requestOptions: {
    //  agent //ONLY USE ONE IF YOU KNOW WHAT YOU DO!
    //},
    highWaterMark: 1024 * 1024 * 64,
    quality: "highestaudio",
    format: "audioonly",
    liveBuffer: 60000,
    dlChunkSize: 1024 * 1024 * 64,
  },
  youtubeDL: true,
  updateYouTubeDL: true,
  customFilters: filters,
  plugins: [
    new SpotifyPlugin(spotifyoptions),
    new SoundCloudPlugin()
  ]
})
//Define some Global Collections
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.msgcooldowns = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.categories = require("fs").readdirSync(`./commands`);
client.allEmojis = require("./botconfig/emojis.json");
const { logMessage, refreshPunishDB } = require(`./handlers/newfunctions`);
const { joinChannel, connect } = require(`./TwitchBot/index`);
client.setMaxListeners(100); require('events').defaultMaxListeners = 100;
client.settings = new Enmap({ name: "settings", dataDir: "./databases/settings" });
client.features = new Enmap({ name: "features", dataDir: "./databases/features" });
client.twitchfeatures = new Enmap({ name: "twitchfeatures", dataDir: "./databases/twitchfeatures" });
client.infos = new Enmap({ name: "infos", dataDir: "./databases/infos" });
// CRON JOB SETTINGS

cron.schedule('0 */3 * * *', () => {
  client.guilds.cache.each(guild => {
    try {
      if (!client.settings.get(guild.id, "randomtopic").length === 0) {
        const topic = guild.channels.cache.find(c => c.id == client.settings.get(guild.id, "randomtopic"));
        const request = require('request');

        const options = {
          method: 'GET',
          url: 'https://trivia-by-api-ninjas.p.rapidapi.com/v1/trivia',
          headers: {
            'x-rapidapi-host': 'trivia-by-api-ninjas.p.rapidapi.com',
            'x-rapidapi-key': 'e0980a2f6emshbf207eddf0a785ep128763jsn5fc56351a0d0',
            useQueryString: true
          }
        };
        try {
          request(options, function (error, response, body) {
            //if (error) throw new Error(error);
            let json = JSON.parse(body);
            //console.log(json);
            topic.send(`Random Question: :${json[0]['question']} \n \n To see the answer click: ||${json[0]['answer']}||`);
          });
        }
        catch (err2) {
          //console.log(err2);
        }


      } else {
        //console.log('The server ' + guild.name + ' has no Random Topic channels.');
      }
    } catch (err) {
      //console.log(err);
      //console.log('Could not send message to ' + guild.name + '.');
    }
  });
});
cron.schedule('0 0 * * *', () => {
  refreshPunishDB(client);
  connect();
  console.log('Punishment Database Synced.');
});


//channel.guild.channels.cache.find(c => c.id == client.settings.get(channel.guild.id, "logchannel")).send({ embeds: [embed] });




//Require the Handlers                  Add the antiCrash file too, if its enabled
["events", "commands", "slashCommands", settings.antiCrash ? "antiCrash" : null, "distubeEvent"]
  .filter(Boolean)
  .forEach(h => {
    require(`./handlers/${h}`)(client);
  })
const YouTubeNotifier = require('youtube-notification');

const notifier = new YouTubeNotifier({
  hubCallback: 'http://modmanager.manumission247.co.uk:38455/yt',
  secret: 'NhqR9CUCU5fqb%h44e'
});


notifier.on('notified', data => {
  console.log(data);
  console.log('New Video');
  /*client.channels.cache.get(SERVER_CHANNEL_ID).send(
    `**${data.channel.name}** just uploaded a new video - **${data.video.link}**`
  );
  */
});
//Start the Bot

const SQLite = require("better-sqlite3");
const ytsql = new SQLite(`./databases/yt.sqlite`);
const yttable = ytsql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'ytsubs';").get();
if (!yttable['count(*)']) {
  // If the table isn't there, create it and setup the database correctly.
  ytsql.prepare("CREATE TABLE ytsubs (id TEXT PRIMARY KEY, ytchan TEXT, guild TEXT, role TEXT, channel TEXT);").run();
  // Ensure that the "id" row is always unique and indexed.
  ytsql.prepare("CREATE UNIQUE INDEX idx_yttable_id ON ytsubs (id);").run();
  ytsql.pragma("synchronous = 1");
  ytsql.pragma("journal_mode = wal");
}

const top10 = ytsql.prepare("SELECT * FROM ytsubs").all();
var rrlist = "Subscribing to channels: \n";
for (const data of top10) {
  rrlist += `Subscribing to: ${data.ytchan} \n`;
  notifier.subscribe(data.ytchan);
}
console.log(rrlist);
console.log("End of Subscriptions");
// SUBSCRIBE TO EACH CHANNEL
client.login(config.token)


/**
 * @LOAD_THE_DASHBOARD - Loading the Dashbaord Module with the BotClient into it!
 */
client.on("ready", () => {
  require("./dashboard/index.js")(client);
  require("./TwitchBot/index.js")(client);
})