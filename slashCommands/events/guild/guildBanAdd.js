const {
    MessageEmbed,
    Message
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require(`../../handlers/functions`);
const Discord = require(`discord.js`);
const SQLite = require("better-sqlite3");
const bansql = new SQLite(`./databases/bans.sqlite`);
module.exports = async (client, member) => {
    client.addBan = bansql.prepare("INSERT INTO bans (id, user, guild, reason, approved, appealed, date) VALUES (@id, @user, @guild, @reason, @approved, 'No', datetime('now'));");
    client.settings.ensure(member.guild.id, {
        prefix: config.prefix,
        defaultvolume: 50,
        defaultautoplay: false,
        defaultfilters: [`bassboost6`, `clear`],
        djroles: [],
        botchannel: [],
        logxhannel: [],
    })
    // Load the guild's settings
    //console.log("Ban Detected!");
    //console.log(member)
    //console.log(ban);
    if (member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel"))) {
        const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_ADD',
        });
        //console.log(fetchedLogs);
        const banLog = fetchedLogs.entries.first();
        if (!banLog) return console.log(`${member.user.tag} left the guild, most likely of their own will.`);
        const { executor, target } = banLog;
        if (target.id === member.id) {
            var executorKick = "UNKNOWN";
        }
        else {
            var executorKick = executor.tag;
        }
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Modlogs`, member.guild.iconURL())
            .setColor("#ff0000")
            .setFooter(member.guild.name, member.guild.iconURL())
            .setTitle("**Moderation** - Member Banned")
            .addField("**Member**", `${member.user.tag}`, true)
            .addField("**Executor**", `${executorKick}`, true)
            .addField("**Reason**", `${banLog.reason}`)
            .setTimestamp();
        member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel")).send({ embeds: [embed] });
        let banReason = ''
        let banApproved = ''
        if (executor.id == client.user.id) {
            console.log("User joined a server but has been global banned.");
            //do nothing as they are already banned by the bot!
        } else {
            //console.log(banLog);
            if (!banLog.reason) {
                let banid = Math.floor(Math.random() * 9999) + 25;
                let banReason = "LOCAL BAN"
                let banApproved = "LOCAL"
                score = { id: `${member.user.id}-${member.guild.id}-${banid}`, user: member.user.id, guild: member.guild.id, reason: banReason, approved: banApproved };
                client.addBan.run(score);
            } else {
                let banid = Math.floor(Math.random() * 9999) + 25;
                let banReason = banLog.reason
                let banApproved = "PENDING"
                score = { id: `${member.user.id}-${member.guild.id}-${banid}`, user: member.user.id, guild: member.guild.id, reason: banReason, approved: banApproved };
                client.addBan.run(score);
                client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send(`New Global PENDING ban from \n \n ${member.guild.name}`);
            }
        }

        member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel")).send('Ban added to database.');
        //console.log(`Found log channel and sent message: ${settings.modLogChannel} in ${member.guild.id}`);
        client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${member.guild.name} triggered GuildBanAdd: Successfully`);

    }
    else {
        //console.log(`member joined guild that has logs disabled!`);
        return;
    }
};
