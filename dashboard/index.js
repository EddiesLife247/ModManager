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
const BotConfig = require("../configs/config.json");
const SQLite = require("better-sqlite3");
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
    scope: [`identify`, `guilds`, `guilds.join`, 'connections']
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
        client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send(`${req.user.username} / ${req.user.id} Tried to login to the dashboard, but was blocked!`);
        req.session.destroy(() => {
          res.json({ login: false, message: `You have been blocked from the Dashboard. for ${data.reason}`, logout: true })
          req.logout();
        });
        return;
      }
    } else {
      res.redirect(`/dashboard`)
    }
  });



  //When the website is loaded on the main page, render the main page + with those variables
  app.get("/", (req, res) => {
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
      totalpunishments: totalpunishments,
      totalservers: totalservers,
    });
  })
  app.get("/terms", (req, res) => {
    const bansql = new SQLite(`./databases/bans.sqlite`);
    const db = bansql.prepare(`SELECT COUNT(*) rows FROM bans`).all();
    var total = "";
    for (const data of db) {
      total += data.rows;

    }
    const totalpunishments = total;
    const totalservers = client.guilds.cache.size;
    res.render("terms", {

      req: req,
      user: req.isAuthenticated() ? req.user : null,
      //guild: client.guilds.cache.get(req.params.guildID),
      botClient: client,
      Permissions: Permissions,
      bot: settings.website,
      callback: settings.config.callback,
      totalpunishments: totalpunishments,
      totalservers: totalservers,
    });
  })
  app.get("/privacy", (req, res) => {
    const bansql = new SQLite(`./databases/bans.sqlite`);
    const db = bansql.prepare(`SELECT COUNT(*) rows FROM bans`).all();
    var total = "";
    for (const data of db) {
      total += data.rows;

    }
    const totalpunishments = total;
    const totalservers = client.guilds.cache.size;
    res.render("privacy", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      //guild: client.guilds.cache.get(req.params.guildID),
      botClient: client,
      Permissions: Permissions,
      bot: settings.website,
      callback: settings.config.callback,
      totalpunishments: totalpunishments,
      totalservers: totalservers,
    });
  })


  //Logout the user and move him back to the main page
  app.get(`/logout`, function (req, res) {
    const bansql = new SQLite(`./databases/bans.sqlite`);
    const db = bansql.prepare(`SELECT COUNT(*) rows FROM bans`).all();
    var total = "";
    for (const data of db) {
      total += data.rows;

    }
    const totalpunishments = total;
    const totalservers = client.guilds.cache.size;
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
      allbanlist += `<tr><td>${data.id}</td><td><a href="http://modmanager.manumission247.co.uk:2096/bans/${data.user}/">${userName}</td><td>${guildName}</td><td>${data.approved}</td><td>${data.reason}</td><td>${data.appealed}</td><td>${data.date}</td><td>${data.length} days</td></tr>`;
    }
    const db = bansql.prepare(`SELECT COUNT(*) rows FROM bans`).all();
    var total = "";
    for (const data of db) {
      total += data.rows;

    }
    const totalpunishments = total;
    const totalservers = client.guilds.cache.size;
    res.render("allbanlist", {
      allbanlist: allbanlist,
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      //guild: client.guilds.cache.get(req.params.guildID),
      botClient: client,
      Permissions: Permissions,
      bot: settings.website,
      callback: settings.config.callback,
      totalpunishments: totalpunishments,
      totalservers: totalservers,
    });
  })
  app.get("/bans", checkAuth, async (req, res) => {
    const bansql = new SQLite(`./databases/bans.sqlite`);
    const db = bansql.prepare(`SELECT COUNT(*) rows FROM bans`).all();
    var total = "";
    for (const data of db) {
      total += data.rows;

    }
    const totalpunishments = total;
    const totalservers = client.guilds.cache.size;
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
      totalpunishments: totalpunishments,
      totalservers: totalservers,
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
    const db = bansql.prepare(`SELECT COUNT(*) rows FROM bans`).all();
    var total = "";
    for (const data of db) {
      total += data.rows;

    }
    const totalpunishments = total;
    const totalservers = client.guilds.cache.size;
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
      totalpunishments: totalpunishments,
      totalservers: totalservers,
    }
    );
  });
  
    // Dashboard endpoint.
  app.get("/dashboard", checkAuth, async (req, res) => {
    const bansql = new SQLite(`./databases/bans.sqlite`);
    const db = bansql.prepare(`SELECT COUNT(*) rows FROM bans`).all();
    var total = "";
    for (const data of db) {
      total += data.rows;

    }
    const totalpunishments = total;
    const totalservers = client.guilds.cache.size;
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
      totalpunishments: totalpunishments,
      totalservers: totalservers,
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
