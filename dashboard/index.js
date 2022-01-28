const express = require("express");
const http = require("http");
const url = require(`url`);
const path = require(`path`);
const { Permissions, CommandInteractionOptionResolver } = require("discord.js");
const ejs = require("ejs");
const fs = require("fs")
const passport = require(`passport`);
const bodyParser = require("body-parser");
const Strategy = require(`passport-discord`).Strategy;
const BotConfig = require("../botconfig/config.json");
const BotFilters = require("../botconfig/filters.json");
const BotEmojis = require("../botconfig/emojis.json");
const BotEmbed = require("../botconfig/embed.json");
const SQLite = require("better-sqlite3");
const supsql = new SQLite(`./databases/support.sqlite`);
const Discord = require(`discord.js`);

/**
 *  STARTING THE WEBSITE
 * @param {*} client THE DISCORD BOT CLIENT 
 */
module.exports = client => {
  //Start the website
  console.log("Loading DashBoard settings")
  const settings = require("./settings.json");
  // We instantiate express app and the session store.
  const app = express();
  const httpApp = express();
  const session = require(`express-session`);
  const MemoryStore = require(`memorystore`)(session);

  /**
   * @INFO - Initial the Discord Login Setup!
   */
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj, done) => done(null, obj));
  passport.use(new Strategy({
    clientID: settings.config.clientID,
    clientSecret: settings.config.secret,
    callbackURL: settings.config.callback,
    scope: [`identify`, `guilds`, `guilds.join`]
  },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => done(null, profile));
    }));


  /**
   * @INFO - ADD A SESSION SAVER
   */
  app.use(session({
    store: new MemoryStore({ checkPeriod: 86400000 }),
    secret: settings.session,
    resave: false,
    saveUninitialized: false,
  }));

  // initialize passport middleware.
  app.use(passport.initialize());
  app.use(passport.session());


  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, './views'))


  //Those for app.use(s) are for the input of the post method (updateing settings)
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(express.json());
  app.use(express.urlencoded({
    extended: true
  }));

  //LOAD THE ASSETS
  app.use(express.static(path.join(__dirname, './public')));
  //Load .well-known (if available)
  app.use(express.static(path.join(__dirname, '/'), { dotfiles: 'allow' }));

  // We declare a checkAuth function middleware to check if an user is logged in or not, and if not redirect him.
  const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.session.backURL = req.url;
    res.redirect("/login");
  };

  //Login endpoint
  app.get(`/login`, (req, res, next) => {
    if (req.session.backURL) {
      req.session.backURL = req.session.backURL;
    } else if (req.headers.referer) {
      const parsed = url.parse(req.headers.referer);
      if (parsed.hostname === app.locals.domain) {
        req.session.backURL = parsed.path;
      }
    } else {
      req.session.backURL = `/`;
    }
    next();
  }, passport.authenticate(`discord`, { prompt: `none` })
  );


  //Callback endpoint for the login data
  app.get(`/callback`, passport.authenticate(`discord`, { failureRedirect: "/" }), async (req, res) => {
    let banned = false // req.user.id
    const SQLite = require("better-sqlite3");
    const botsql = new SQLite(`./databases/bot.sqlite`);
    //console.log(req.user)
    const top10 = botsql.prepare("SELECT * FROM guildadmin WHERE account = ? AND type = 'DASHBLOCK'").all(req.user.id);
    if (top10.length >= 1) {
      for (const data of top10) {
        banned = true;
        client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`${req.user.username} / ${req.user.id} Tried to login to the dashboard, but was blocked!`);
        req.session.destroy(() => {
          res.json({ login: false, message: `You have been blocked from the Dashboard. for ${data.reason}`, logout: true })
          req.logout();
        });
        return;
      }
    } else {
      client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`${req.user.username} / ${req.user.id} Logged into the dashboard!`);
      res.redirect(`/dashboard`)
    }
  });



  //When the website is loaded on the main page, render the main page + with those variables
  app.get("/", (req, res) => {
    client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`Someone visited the dashboard!`);
    const bansql = new SQLite(`./databases/bans.sqlite`);
    const db = bansql.prepare(`SELECT COUNT(*) rows FROM bans`).all();
    var total = "";
    for (const data of db) {
      total += data.rows;

    }
    const totalpunishments = total;
    const totalservers = client.guilds.cache.size;

    res.render("index", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      //guild: client.guilds.cache.get(req.params.guildID),
      botClient: client,
      Permissions: Permissions,
      bot: settings.website,
      callback: settings.config.callback,
      categories: client.categories,
      commands: client.commands,
      BotConfig: BotConfig,
      BotFilters: BotFilters,
      BotEmojis: BotEmojis,
      totalpunishments: totalpunishments,
      totalservers: totalservers,
    });
  })
  app.get("/terms", (req, res) => {
    res.render("terms", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      //guild: client.guilds.cache.get(req.params.guildID),
      botClient: client,
      Permissions: Permissions,
      bot: settings.website,
      callback: settings.config.callback,
      categories: client.categories,
      commands: client.commands,
      BotConfig: BotConfig,
      BotFilters: BotFilters,
      BotEmojis: BotEmojis,
    });
  })
  app.get("/privacy", (req, res) => {
    res.render("privacy", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      //guild: client.guilds.cache.get(req.params.guildID),
      botClient: client,
      Permissions: Permissions,
      bot: settings.website,
      callback: settings.config.callback,
      categories: client.categories,
      commands: client.commands,
      BotConfig: BotConfig,
      BotFilters: BotFilters,
      BotEmojis: BotEmojis,
    });
  })

  // When the commands page is loaded, render it with those settings
  app.get("/commands", (req, res) => {
    res.render("commands", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      //guild: client.guilds.cache.get(req.params.guildID),
      botClient: client,
      Permissions: Permissions,
      bot: settings.website,
      callback: settings.config.callback,
      categories: client.categories,
      commands: client.commands,
      BotConfig: BotConfig,
      BotFilters: BotFilters,
      BotEmojis: BotEmojis,
    })
  })


  //Logout the user and move him back to the main page
  app.get(`/logout`, function (req, res) {
    req.session.destroy(() => {
      req.logout();
      res.redirect(`/`);
    });
  });
  // Dashboard endpoint.
  app.get("/allbans", checkAuth, async (req, res) => {
    if (!req.isAuthenticated() || !req.user)
      return res.redirect("/?error=" + encodeURIComponent("Login First!"));
    if (!req.user.guilds)
      return res.redirect("/?error=" + encodeURIComponent("Unable to get your Guilds!"));
    const bansql = new SQLite(`./databases/bans.sqlite`);
    var allbanlist = "";
    const top10 = bansql.prepare("SELECT * FROM bans").all();
    for (const data of top10) {
      let guildName = "";
      if (client.guilds.cache.get(data.guild) == undefined) {
        guildName = data.guild;
      } else {
        guildName = client.guilds.cache.get(data.guild).name;
      }
      let userName = "";
      if (client.users.cache.get(data.user) == undefined) {
        userName = data.user;
      } else {
        userName = client.users.cache.get(data.user).username;
      }
      allbanlist += `<tr><td>${data.id}</td><td><a href="http://modmanager.manumission247.co.uk:38455/bans/${data.user}/">${userName}</td><td>${guildName}</td><td>${data.approved}</td><td>${data.reason}</td><td>${data.appealed}</td><td>${data.date}</td><td>${data.length} days</td></tr>`;
    }
    res.render("allbanlist", {
      allbanlist: allbanlist,
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      //guild: client.guilds.cache.get(req.params.guildID),
      botClient: client,
      Permissions: Permissions,
      bot: settings.website,
      callback: settings.config.callback,
      categories: client.categories,
      commands: client.commands,
      BotConfig: BotConfig,
      BotFilters: BotFilters,
      BotEmojis: BotEmojis,
    });
  })
  app.get("/bans", checkAuth, async (req, res) => {
    if (!req.isAuthenticated() || !req.user)
      return res.redirect("/?error=" + encodeURIComponent("Login First!"));
    if (!req.user.guilds)
      return res.redirect("/?error=" + encodeURIComponent("Unable to get your Guilds!"));
    res.render("bans", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      //guild: client.guilds.cache.get(req.params.guildID),
      botClient: client,
      Permissions: Permissions,
      bot: settings.website,
      callback: settings.config.callback,
      categories: client.categories,
      commands: client.commands,
      BotConfig: BotConfig,
      BotFilters: BotFilters,
      BotEmojis: BotEmojis,
    });
  })
  app.get("/bans/:userId", checkAuth, async (req, res) => {
    // We validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
    const userId = client.users.cache.get(req.params.userId);
    var trustlevel = 0;
    var reason = "";
    const Discord_Employee = 1;
    const Partnered_Server_Owner = 2;
    const HypeSquad_Events = 4;
    const Bug_Hunter_Level_1 = 8;
    const House_Bravery = 64;
    const House_Brilliance = 128;
    const House_Balance = 256;
    const Early_Supporter = 512;
    const Bug_Hunter_Level_2 = 16384;
    const Early_Verified_Bot_Developer = 131072;
    const bansql = new SQLite(`./databases/bans.sqlite`);
    if (userId) {

      const localBanCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'LOCAL' AND user = ${req.params.userId}`).all();
      const globalBanCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'GLOBAL' AND user = ${req.params.userId}`).all();
      const KickCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'KICK' AND user = ${req.params.userId}`).all();
      const warningCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'WARNING' AND user = ${req.params.userId}`).all();
      const timeoutCount = bansql.prepare(`SELECT * FROM bans WHERE approved = 'TIMEOUT' AND user = ${req.params.userId}`).all();

      const flags = userId.public_flags;
      //console.log(userId.avatar);
      if (Date.now() - userId.createdAt < 1000 * 60 * 60 * 24 * 10) {
        trustlevel = trustlevel - 1;
        reason = reason + `<br /><strong> -1 </strong> Account younger than 10 days`;
      } else {
        trustlevel = trustlevel + 5;
        reason = reason + `<br /><strong> +5 </strong>Account older than 10 days`;
      }
      if (Date.now() - userId.createdAt > 1000 * 60 * 60 * 24 * 365) {
        trustlevel = trustlevel + 5;
        reason = reason + `<br /><strong> +5 </strong>Account older than 1 year(s)`;
      } else {
        trustlevel = trustlevel - 1;
        reason = reason + `<br /><strong> -1 </strong>Account younger than 1 year old`;

      }
      if ((flags & Discord_Employee) == Discord_Employee) {
        trustlevel = trustlevel + 5;
        reason = reason + `<br /><strong> +5 </strong>You are a discord employee`;
      }
      else {
        trustlevel = trustlevel - 1;
        reason = reason + `<br /><strong> -1 </strong>You are a not discord employee`;
      }
      if ((flags & Early_Supporter) == Early_Supporter) {
        trustlevel = trustlevel + 5;
        reason = reason + `<br /><strong> +5 </strong>You are an early supporter`;

      }
      else {
        trustlevel = trustlevel - 1;
        reason = reason + `<br /><strong> -1 </strong>You are a not an early supporter`;
      }
      if ((flags & Early_Verified_Bot_Developer) == Early_Verified_Bot_Developer) {
        trustlevel = trustlevel + 5;
        reason = reason + `<br /><strong> +5 </strong>You are a verified bot developer`;

      }
      else {
        trustlevel = trustlevel - 1;
        reason = reason + `<br /><strong> -1 </strong>You are not a verified bot developer`;
      }
      if (userId.avatar) {
        trustlevel = trustlevel + 5;
        reason = reason + `<br /><strong> +5 </strong>You have an avatar`;
      }
      else {
        trustlevel = trustlevel - 1;
        reason = reason + `<br /><strong> -1 </strong>You do not have an avatar`;
      }
      if (localBanCount.length < 1) {
        trustlevel = trustlevel + 5;
        reason = reason + `<br /><strong> +5 </strong>You do not have any active bans on record.`;
      }
      else {
        trustlevel = trustlevel - localBanCount.length;
        reason = reason + `<br /> <strong>-${localBanCount.length}</strong> You have active bans on record`;
      }
      if (timeoutCount.length < 1) {
        trustlevel = trustlevel + 5;
        reason = reason + `<br /><strong> +5 </strong>You do not have any active timeout's on record.`;
      }
      else {
        trustlevel = trustlevel - timeoutCount.length;
        reason = reason + `<br /> <strong>-${localBanCount.length}</strong> You have active timeout's on record`;
      }
      if (warningCount < 1) {
        trustlevel = trustlevel + 5;
        reason = reason + `<br /><strong> +5 </strong>You do not have any active warnings on record.`;
      }
      else {
        trustlevel = trustlevel - warningCount.length;
        reason = reason + `<br /> <strong>-${localBanCount.length}</strong> You have active warnings on record`;
      }
      if (KickCount < 1) {
        trustlevel = trustlevel + 5;
        reason = reason + `<br /><strong> +5 </strong>You do not have any active kick's on record.`;
      }
      else {
        trustlevel = trustlevel - KickCount.length;
        reason = reason + `<br /> <strong>-${KickCount.length}</strong> You have active kick's on record`;
      }
      if (globalBanCount < 1) {
        trustlevel = trustlevel + 5;
        reason = reason + `<br /><strong> +5 </strong>You do not have any active global ban's on record.`;
      }
      else {
        trustlevel = trustlevel - globalBanCount.length;
        reason = reason + `<br /> <strong>-${localBanCount.length}</strong> You have active global ban's on record`;
      }
    } else {
      reason = `We cannot find information on this user.`
    }
    //if (!userId) return res.redirect("/allbans?error=" + encodeURIComponent("Can't get User Information Data"));

    var banlist = "";
    if (client.users.cache.get(req.params.userId) == undefined) {
      userName = req.params.userId;
    } else {
      userName = client.users.cache.get(req.params.userId).username;
    }
    const top10 = bansql.prepare("SELECT * FROM bans WHERE user = ?").all(req.params.userId);
    for (const data of top10) {
      let guildName = "";
      if (client.guilds.cache.get(data.guild) == undefined) {
        guildName = data.guild;
      } else {
        guildName = client.guilds.cache.get(data.guild).name;
      }
      banlist += `<tr><td>${data.id}</td><td>${guildName}</td><td>${data.approved}</td><td>${data.reason}</td><td>${data.appealed}</td><td>${data.date}</td><td>${data.length} days</td></tr>`;
    }

    res.render("banlist", {
      banlist: banlist,
      username: userName,
      reason: reason,
      trustlevel: trustlevel,
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      bannedUser: client.users.cache.get(req.params.userId),
      //guild: client.guilds.cache.get(req.params.guildID),
      botClient: client,
      Permissions: Permissions,
      bot: settings.website,
      callback: settings.config.callback,
      categories: client.categories,
      commands: client.commands,
      BotConfig: BotConfig,
      BotFilters: BotFilters,
      BotEmojis: BotEmojis,
    }
    );
  });
  app.get("/leaderboard", checkAuth, async (req, res) => {
    if (!req.isAuthenticated() || !req.user)
      return res.redirect("/?error=" + encodeURIComponent("Login First!"));
    if (!req.user.guilds)
      return res.redirect("/?error=" + encodeURIComponent("Unable to get your Guilds!"));
    res.render("leaderboard", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      //guild: client.guilds.cache.get(req.params.guildID),
      botClient: client,
      Permissions: Permissions,
      bot: settings.website,
      callback: settings.config.callback,
      categories: client.categories,
      commands: client.commands,
      BotConfig: BotConfig,
      BotFilters: BotFilters,
      BotEmojis: BotEmojis,
    });
  })
  app.get("/leaderboard/:guildID", checkAuth, async (req, res) => {
    // We validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
    const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.redirect("/dashboard?error=" + encodeURIComponent("Can't get Guild Information Data"));
    let member = guild.members.cache.get(req.user.id);
    if (!member) {
      try {
        member = await guild.members.fetch(req.user.id);
      } catch (err) {
        console.error(`Couldn't fetch ${req.user.id} in ${guild.name}: ${err}`);
      }
    }
    if (!member) return res.redirect("/dashboard?error=" + encodeURIComponent("Unable to fetch you, sorry!"));
    //GET SCORES
    const sql = new SQLite(`./databases/scores.sqlite`);
    client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
    const top10 = sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC;").all(guild.id);
    var scores = "";
    for (const data of top10) {
      if (client.users.cache.get(data.user)) {
        username = client.users.cache.get(data.user).tag
      } else {
        username = data.user;
      }
      scores += `<tr><td>${username}</td><td>${data.points}</td><td>${data.level}</td></tr>`;
    }
    var scoresadmin = "";
    for (const data of top10) {
      if (client.users.cache.get(data.user)) {
        username = client.users.cache.get(data.user).tag
      } else {
        username = data.user;
      }
      scoresadmin += `<tr><td>${username}<input type="hidden" name="user" value="${data.user}" /></td><td><input type="text" name="points[${data.user}]" value="${data.points}" /></td><td><input type="text" name="level[${data.user}]" value="${data.level}"></td></tr>`;
    }
    const difficulty = client.settings.get(guild.id, `serverdifficulty`);
    var admin = false;
    if (member.permissions.has("MANAGE_GUILD")) {
      admin = true;
    }
    res.render("scores", {
      scores: scores,
      scoresadmin: scoresadmin,
      admin: admin,
      difficulty: difficulty,
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      guild: client.guilds.cache.get(req.params.guildID),
      botClient: client,
      Permissions: Permissions,
      bot: settings.website,
      callback: settings.config.callback,
      categories: client.categories,
      commands: client.commands,
      BotConfig: BotConfig,
      BotFilters: BotFilters,
      BotEmojis: BotEmojis,
    }
    );
  });
  const YouTubeNotifier = require('youtube-notification');

  const notifier = new YouTubeNotifier({
    hubCallback: 'http://modmanager.manumission247.co.uk:38455/yt',
    secret: 'NhqR9CUCU5fqb%h44e'
  });
  app.get("/yt", notifier.listener());
  notifier.on('notified', data => {
    console.log(data);
    console.log('New Video');
    /*client.channels.cache.get(SERVER_CHANNEL_ID).send(
      `**${data.channel.name}** just uploaded a new video - **${data.video.link}**`
    );
    */
  });
  // Dashboard endpoint.
  app.get("/dashboard", checkAuth, async (req, res) => {
    if (!req.isAuthenticated() || !req.user)
      return res.redirect("/?error=" + encodeURIComponent("Login First!"));
    if (!req.user.guilds)
      return res.redirect("/?error=" + encodeURIComponent("Unable to get your Guilds!"));
    res.render("dashboard", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      //guild: client.guilds.cache.get(req.params.guildID),
      botClient: client,
      Permissions: Permissions,
      bot: settings.website,
      callback: settings.config.callback,
      categories: client.categories,
      commands: client.commands,
      BotConfig: BotConfig,
      BotFilters: BotFilters,
      BotEmojis: BotEmojis,
    });

  })
  // Settings endpoint.
  app.get("/dashboard/:guildID", checkAuth, async (req, res) => {
    // We validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
    const guild = client.guilds.cache.get(req.params.guildID);
    // feature end point code
    client.features.ensure(guild.id, {
      music: true,
      logs: true,
      reactionroles: true,
      moderation: true,
      fun: true,
      youtube: false,
      support: true,
      points: true,
      twitchbot: true,
      twitchFilter: true,
      twitchlurk: '',
    });
    // end feature end point code
    if (!guild) return res.redirect("/dashboard?error=" + encodeURIComponent("Can't get Guild Information Data"));
    let member = guild.members.cache.get(req.user.id);
    if (!member) {
      try {
        member = await guild.members.fetch(req.user.id);
      } catch (err) {
        console.error(`Couldn't fetch ${req.user.id} in ${guild.name}: ${err}`);
      }
    }
    if (!member) return res.redirect("/dashboard?error=" + encodeURIComponent("Unable to fetch you, sorry!"));
    if (!member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
      return res.redirect("/dashboard?error=" + encodeURIComponent("You are not allowed to do that!"));
    }


    client.settings.ensure(guild.id, {
      prefix: BotConfig.prefix,
      defaultvolume: 50,
      defaultautoplay: false,
      defaultfilters: [`bassboost6`, `clear`],
      djroles: [],
      muterole: [],
      botchannel: [],
      logchannel: [],
      joinrole: [],
      staffchan: [],
      randomtopic: [],
      qotdchannel: [],
      topicmodlogs: true,
      rrchannel: [],
      youchannel: [],
      partnerchannel: [],
      serverdifficulty: "Medium",
      levelupchan: [],
      invitefilter: false,
      urlfilter: false,
      NSFWurlfilter: false,
      swearfilter: false,
      supportTeamId: [],
      globalbans: false,
      warnkick: '',
      kickban: '',
      cooldown: null,
      welcomechannel: [],
      welcomemsg: '',
      acceptedtrust: '',
      timeoutLength: '',

    })
    const twitchsql = new SQLite(`./databases/twitch.sqlite`);
    const twitchdata = twitchsql.prepare("SELECT * FROM twitch WHERE guild = ?").all(guild.id);
    var twitchlist = "";
    for (const data of twitchdata) {
      if (data == undefined) {
        twitchlist = "";
        twitchinvite = "";
      } else {
        twitchlist = data.twitch;
        twitchinvite = data.invite;
        console.log(twitchinvite);
      }
    }

    const rrsql = new SQLite(`./databases/rr.sqlite`);
    const top10 = rrsql.prepare("SELECT * FROM rrtable WHERE guild = ?").all(guild.id);
    var rrlist2 = "";
    for (const data of top10) {
      if (data == undefined) {
        rrlist2 = "END OF DATA";
        var role = "";
        var channel = "";
      } else {
        if (guild.roles.cache.get(data.role)) {
          var role = guild.roles.cache.get(data.role).name;
        }
        else {
          var role = data.role;
        }
        if (guild.channels.cache.get(data.channel)) {
          let channel = guild.channels.cache.get(data.channel).name;
        } else {
          var channel = data.channel
        }
        //console.log(role);
        rrlist2 += `<tr><td>${data.emoji}</td><td>${role}</td> <td>${channel}</td><td>${data.messageid}</td></tr>`;
      }
    }
    var suplist = "";
    const tickets = supsql.prepare("SELECT * FROM tickets WHERE guild = ? AND status = 'Open'").all(guild.id);
    for (const data of tickets) {
      if (data == undefined) {
        suplist = "NO TICKETS FOUND";
      } else {
        let user = guild.members.cache.get(data.user).user
        //console.log(user.username);
        suplist += `<tr><td>${user.username}</td><td>${data.subject}</td> <td>${data.status}</td></tr>`;
      }
    }

    // We render template using the absolute path of the template and the merged default data with the additional data provided.
    res.render("settings", {
      suplist: suplist,
      rrlist2: rrlist2,
      twitchlist: twitchlist,
      twitchinvite: twitchinvite,
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      guild: client.guilds.cache.get(req.params.guildID),
      botClient: client,
      Permissions: Permissions,
      bot: settings.website,
      callback: settings.config.callback,
      categories: client.categories,
      commands: client.commands,
      BotConfig: BotConfig,
      BotFilters: BotFilters,
      BotEmojis: BotEmojis,
    }
    );
  });
  app.post("/leaderboard/:guildID", checkAuth, async (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.redirect("/leaderboard?error=" + encodeURIComponent("Can't get Guild Information Data!"));
    let member = guild.members.cache.get(req.user.id);
    if (!member.permissions.has("MANAGE_GUILD")) {
      return res.redirect("/leaderboard?error=" + encodeURIComponent("You are not allowed to do that!"));
    }
    const sql = new SQLite(`./databases/scores.sqlite`);
    client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
    client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");
    const top10 = sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC;").all(guild.id);
    var scores = "";
    let difficulty = 0.3;
    let serverdifficulty = client.settings.get(guild.id, `serverdifficulty`)
    if (serverdifficulty == "Hard") {
      difficulty = 0.1;
    }
    else if (serverdifficulty == "Medium" || serverdifficulty == "") {
      difficulty = 0.3;
    }
    else if (serverdifficulty == "Easy") {
      difficulty = 0.6;
    }
    for (const data of top10) {
      // Get Users ID
      if (req.body.user = data.user) {

        let userScore = client.getScore.get(data.user.id, guild.id);

        // It's possible to give points to a user we haven't seen, so we need to initiate defaults here too!
        if (!userScore) {
          userScore = { id: `${guild.id}-${data.user}`, user: data.user, guild: guild.id, points: 0, level: 1 }
        }
        let pointBody = req.body.points[data.user];
        userScore.points = pointBody;
        console.log(userScore.points);

        let levelBody = req.body.level[data.user];
        let userLevel = Math.floor(difficulty * Math.sqrt(pointBody));
        userScore.level = levelBody;

        // And we save it!
        client.setScore.run(userScore);
        //UPDATE SCORES
      }
    }
  });

  // Settings endpoint.
  app.post("/dashboard/:guildID", checkAuth, async (req, res) => {
    // We validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
    const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.redirect("/dashboard?error=" + encodeURIComponent("Can't get Guild Information Data!"));
    let member = guild.members.cache.get(req.user.id);
    if (!member) {
      try {
        member = await guild.members.fetch(req.user.id);
      } catch (err) {
        console.error(`Couldn't fetch ${req.user.id} in ${guild.name}: ${err}`);
      }
    }
    if (!member) return res.redirect("/dashboard?error=" + encodeURIComponent("Can't Information Data about you!"));
    if (!member.permissions.has("MANAGE_GUILD")) {
      return res.redirect("/dashboard?error=" + encodeURIComponent("You are not allowed to do that!"));
    }
    let prefix = "";
    if (req.body.prefix) {
      client.settings.set(guild.id, String(req.body.prefix).split(" ")[0], "prefix")
      prefix = req.body.prefix;
    }
    else {
      prefix = client.settings.get(guild.id, "prefix")
    }
    let warnkick = "";
    if (req.body.prefix) {
      client.settings.set(guild.id, String(req.body.warnkick).split(" ")[0], "warnkick")
      warnkick = req.body.warnkick;
    }
    else {
      warnkick = "DISABLED";
    }
    let kickban = "";
    if (req.body.kickban) {
      client.settings.set(guild.id, String(req.body.kickban).split(" ")[0], "kickban")
      kickban = req.body.kickban;
    }
    else {
      kickban = "DISABLED";
    }
    if (req.body.defaultvolume) client.settings.set(guild.id, Number(req.body.defaultvolume), "defaultvolume")
    //if autoplay is enabled set it to true
    if (req.body.defaultautoplay) client.settings.set(guild.id, true, "defaultautoplay")
    //otherwise not
    else client.settings.set(guild.id, false, "defaultautoplay")
    if (req.body.topicmodlogs) client.settings.set(guild.id, true, "topicmodlogs")
    //otherwise not
    else client.settings.set(guild.id, false, "topicmodlogs")
    let swearfilter = "";
    let urlfilter = "";
    let invitefilter = "";
    let globalbans = "";
    let timeoutLength = "";
    let staffchan = "";
    let levelupchan = "";
    let cooldown = "";
    let NSFWurlfilter = "";
    let welcomechannel = "";
    let welcomemsg = "";
    let muterole = '';
    let acceptedtrust = '';
    let joinrole = '';
    if (req.body.joinrole) {
      client.settings.set(guild.id, req.body.joinrole, "joinrole")
      joinrole = req.body.joinrole;
    } else {
      joinrole = 'NONE';
    }
    if (req.body.swearfilter) {
      client.settings.set(guild.id, true, "swearfilter")
      swearfilter = "ON";
      //otherwise not
    } else {
      client.settings.set(guild.id, false, "swearfilter")
      swearfilter = "OFF";
    }

    if (req.body.urlfilter) {
      client.settings.set(guild.id, true, "urlfilter")
      //otherwise not
      urlfilter = "ON";
      //otherwise not
    } else {
      client.settings.set(guild.id, false, "urlfilter")
      urlfilter = "OFF";
    }
    if (req.body.NSFWurlfilter) {
      client.settings.set(guild.id, true, "NSFWurlfilter")
      //otherwise not
      NSFWurlfilter = "ON";
      //otherwise not
    } else {
      client.settings.set(guild.id, false, "NSFWurlfilter")
      NSFWurlfilter = "OFF";
    }
    if (req.body.invitefilter) {
      client.settings.set(guild.id, true, "invitefilter")
      //otherwise not
      invitefilter = "ON";
      //otherwise not
    } else {
      client.settings.set(guild.id, false, "invitefilter")
      invitefilter = "OFF";
    }
    //otherwise not
    if (req.body.globalbans) {
      client.settings.set(guild.id, true, "globalbans")
      //otherwise not
      globalbans = "ON";
      //otherwise not
    } else {
      client.settings.set(guild.id, false, "globalbans")
      globalbans = "OFF";
    }
    //otherwise not
    //if there are new defaultfilters, set them
    if (req.body.defaultfilters) {
      client.settings.set(guild.id, req.body.defaultfilters, "defaultfilters")
      const defaultfilters = req.body.defaultfilters;
    } else {
      const defaultfilters = 'NONE';
    }
    if (req.body.cooldown) {
      client.settings.set(guild.id, req.body.cooldown, "cooldown")
      cooldown = req.body.cooldown;
    } else {
      cooldown = 'DISABLED';
    }
    if (req.body.twitchlurk) {
      client.features.set(guild.id, req.body.twitchlurk, "twitchlurk")
      twitchlurk = req.body.twitchlurk;
    } else {
      twitchlurk = '';
    }
    if (req.body.twitchlist) {
      client.settings.set(guild.id, req.body.twitchlist, "twitchlist")
      twitchlist = req.body.twitchlist;
    } else {
      twitchlist = '';
    }
    if (req.body.twitchinvite) {
      client.settings.set(guild.id, req.body.twitchinvite, "twitchinvite")
      twitchinvite = req.body.twitchinvite;
    } else {
      twitchinvite = '';
    }
    if (req.body.acceptedtrust) {
      client.settings.set(guild.id, req.body.acceptedtrust, "acceptedtrust")
      acceptedtrust = req.body.acceptedtrust;
    } else {
      acceptedtrust = 'DISABLED';
    }
    if (req.body.timeoutLength) {
      client.settings.set(guild.id, req.body.timeoutLength, "timeoutLength")
      timeoutLength = req.body.timeoutLength;
    } else {
      timeoutLength = '60';
    }

    if (req.body.djroles) {
      client.settings.set(guild.id, req.body.djroles, "djroles")
      let djroles = req.body.djroles;
    } else {
      const djroles = 'NONE';
    }
    if (req.body.muterole) {
      client.settings.set(guild.id, req.body.muterole, "muterole")
      muterole = req.body.muterole;
    } else {
      muterole = 'NONE';
    }
    if (req.body.botchannel) client.settings.set(guild.id, req.body.botchannel, "botchannel")
    if (req.body.partnerchannel) client.settings.set(guild.id, req.body.partnerchannel, "partnerchannel")
    if (req.body.staffchan) {
      client.settings.set(guild.id, req.body.staffchan, "staffchan")
      staffchan = req.body.staffchan;
    } else {
      staffchan = 'NONE';
    }
    if (req.body.welcomechannel) {
      client.settings.set(guild.id, req.body.welcomechannel, "welcomechannel")
      welcomechannel = req.body.welcomechannel;
    } else {
      welcomechannel = 'NONE';
    }
    if (req.body.welcomemsg) {
      client.settings.set(guild.id, req.body.welcomemsg, "welcomemsg")
      welcomemsg = req.body.welcomemsg;
    } else {
      welcomemsg = 'NO MESSAGE';
    }
    //console.log(req.body.moderation);
    if (req.body.logchannel) client.settings.set(guild.id, req.body.logchannel, "logchannel")
    if (req.body.randomtopic) client.settings.set(guild.id, req.body.randomtopic, "randomtopic")
    if (req.body.qotdchannel) client.settings.set(guild.id, req.body.qotdchannel, "qotdchannel")
    if (req.body.music) {
      client.features.set(guild.id, true, "music")
    } else {
      client.features.set(guild.id, false, "music")
    }
    if (req.body.twitchbot) {
      client.features.set(guild.id, true, "twitchbot")
    } else {
      client.features.set(guild.id, false, "twitchbot")
    }
    if (req.body.logmsg) {
      client.features.set(guild.id, true, "logs")
    } else {
      client.features.set(guild.id, false, "logs")
    }
    if (req.body.moderation) {
      client.features.set(guild.id, true, "moderation")
    } else {
      client.features.set(guild.id, false, "moderation")
    }
    if (req.body.twitchFilter) {
      client.features.set(guild.id, true, "twitchFilter")
    } else {
      client.features.set(guild.id, false, "twitchFilter")
    }
    if (req.body.reactionroles) {
      client.features.set(guild.id, true, "reactionroles")
    } else {
      client.features.set(guild.id, false, "reactionroles")
    }
    if (req.body.youtube) {
      client.features.set(guild.id, true, "youtube")
    } else {
      client.features.set(guild.id, false, "youtube")
    }
    if (req.body.points) {
      client.features.set(guild.id, true, "points")
    } else {
      client.features.set(guild.id, false, "points")
    }
    if (req.body.support) {
      client.features.set(guild.id, true, "support")
    } else {
      client.features.set(guild.id, false, "support")
    }
    if (req.body.levelupchan) {
      client.settings.set(guild.id, req.body.levelupchan, "levelupchan")
      levelupchan = req.body.levelupchan;
    } else {
      levelupchan = 'NONE';
    }

    if (req.body.supportTeamId) client.settings.set(guild.id, req.body.supportTeamId, "supportTeamId")

    if (req.body.serverdifficulty) client.settings.set(guild.id, req.body.serverdifficulty, "serverdifficulty")
    if (guild.channels.cache.find(c => c.id == client.settings.get(guild.id, "logchannel"))) {
      const embed = new Discord.MessageEmbed()
        .setAuthor(`Modlogs`, guild.iconURL())
        .setColor("#00ff00")
        .setFooter(guild.name, guild.iconURL())
        .setTitle("**Dashboard Settings Changed**")
        .addField("**View the settings on the dashboard**", `Click the link below`, true)
        .setURL(`http://modmanager.manumission247.co.uk:38455/dashboard/${guild.id}`)
        .setTimestamp();



      guild.channels.cache.find(c => c.id == client.settings.get(guild.id, "logchannel")).send({ embeds: [embed] });
      client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n <@${req.user.id}> Updated Guild ${guild.name} Settings via Dashboard`);
    }
    const twitchsql = new SQLite(`./databases/twitch.sqlite`);
    const twichsqldata = twitchsql.prepare("SELECT * FROM twitch WHERE guild = ?").all(guild.id);
    var twitchdata = "";
    var twitchinvite = "";
    for (const data of twichsqldata) {
      if (data == undefined) {
        twitchdata = "";
        twitchinvite = "";
      } else {
        twitchdata = data.twitch;
        twitchinvite = data.invite;
      }
    }
    if (twitchdata) {
      if (twitchlist) {
        twitchsql.prepare(`UPDATE twitch SET 'twitch' = '${twitchlist}', 'invite' = '${twitchinvite}' WHERE guild = '${guild.id}'`).run();
      } else {
        twitchsql.prepare(`DELETE FROM twitch WHERE guild = '${guild.id}'`).run();
      }
    } else {
      if (twitchlist) {
        twitchsql.prepare(`INSERT INTO twitch ('twitch', 'guild', 'invite') VALUES ('${twitchlist}',  '${guild.id}', '${twitchinvite}')`).run();
      } else {
        twitchsql.prepare(`DELETE FROM twitch WHERE guild = '${guild.id}'`).run();
      }
    }
    


    const rrsql = new SQLite(`./databases/rr.sqlite`);
    const top10 = rrsql.prepare("SELECT * FROM rrtable WHERE guild = ?").all(guild.id);
    var rrlist2 = "";
    for (const data of top10) {
      if (data == undefined) {
        rrlist2 = "END OF DATA";
      } else {

        let role = guild.roles.cache.get(data.role);
        let channel = guild.channels.cache.get(data.channel)
        //console.log(role);
        if (role.name) {
          rrlist2 += `<tr><td>${data.emoji}</td><td>${role.name}</td> <td>${channel.name}</td><td>${data.messageid}</td></tr>`;
        }
        else {
          rrlist2 += `<tr><td>${data.emoji}</td><td>${role.id}</td> <td>${channel.name}</td><td>${data.messageid}</td></tr>`;
        }
      }
    }
    var suplist = "";
    const tickets = supsql.prepare("SELECT * FROM tickets WHERE guild = ? AND status = 'Open'").all(guild.id);
    for (const data of tickets) {
      if (data == undefined) {
        suplist = "NO TICKETS FOUND";
      } else {
        let user = guild.members.cache.get(data.user).user
        //console.log(user.username);
        suplist += `<tr><td>${user.username}</td><td>${data.subject}</td> <td>${data.status}</td></tr>`;
      }
    }
    // We render template using the absolute path of the template and the merged default data with the additional data provided.
    res.render("settings", {
      suplist: suplist,
      rrlist2: rrlist2,
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      guild: client.guilds.cache.get(req.params.guildID),
      botClient: client,
      twitchlist: twitchlist,
      twitchinvite: twitchinvite,
      Permissions: Permissions,
      bot: settings.website,
      callback: settings.config.callback,
      categories: client.categories,
      commands: client.commands,
      BotConfig: BotConfig,
      BotFilters: BotFilters,
      BotEmojis: BotEmojis,
    }
    );
  });



  // Queue Dash
  app.get("/queue/:guildID", async (req, res) => {
    res.render("queue", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      guild: client.guilds.cache.get(req.params.guildID),
      botClient: client,
      Permissions: Permissions,
      bot: settings.website,
      callback: settings.config.callback,
      categories: client.categories,
      commands: client.commands,
      BotConfig: BotConfig,
      BotFilters: BotFilters,
      BotEmojis: BotEmojis,
    });
  })


  //Queue Dashes
  app.get("/queuedashboard", checkAuth, async (req, res) => {
    if (!req.isAuthenticated() || !req.user)
      return res.redirect("/?error=" + encodeURIComponent("Login First!"));
    if (!req.user.guilds)
      return res.redirect("/?error=" + encodeURIComponent("Unable to get your Guilds!"));
    res.render("queuedashboard", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      //guild: client.guilds.cache.get(req.params.guildID),
      botClient: client,
      Permissions: Permissions,
      bot: settings.website,
      callback: settings.config.callback,
      categories: client.categories,
      commands: client.commands,
      BotConfig: BotConfig,
      BotFilters: BotFilters,
      BotEmojis: BotEmojis,
    });
  })

  /**
   * @START THE WEBSITE
   */
  //START THE WEBSITE ON THE DEFAULT PORT (80)
  const http = require(`http`).createServer(app);
  http.listen(settings.config.http.port, () => {
    console.log(`[${settings.website.domain}]: HTTP-Website running on ${settings.config.http.port} port.`)
  });
}
