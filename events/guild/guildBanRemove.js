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
module.exports = async (client, member) => {
    const guild = member.guild;
    if (guild.me.permissions.has("VIEW_AUDIT_LOG")) {
        client.settings.ensure(member.guild.id, {
            prefix: config.prefix,
            defaultvolume: 50,
            defaultautoplay: false,
            defaultfilters: [`bassboost6`, `clear`],
            djroles: [],
            botchannel: [],
            logxhannel: [],
        })
        const bansql = new SQLite(`./databases/bans.sqlite`);
        client.getBanned = bansql.prepare("SELECT * FROM bans WHERE user = ? AND guild = ?");
        let globalBanned;
        globalBanned = client.getBanned.get(member.user.id, member.guild.id);
        if (globalBanned) {
            bansql.prepare(`DELETE FROM 'bans' WHERE user = '${member.user.id}' AND guild = '${member.guild.id}'`).run()
            client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send(`Ban for ${globalBanned.user} on ${member.guild.name} has been removed by a guild moderator.`);
            client.users.cache.get(member.user.id).send(`Ban on ${member.guild.name} has been removed by a moderator.`);
        }
        // Load the guild's settings
        //console.log("UnBan Detected!");
        //console.log(member)
        //console.log(ban);
        if (member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel"))) {
            const fetchedLogs = await member.guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_BAN_REMOVE',
            });
            //console.log(fetchedLogs);
            const banLog = fetchedLogs.entries.first();
            if (!banLog) return console.log(`${member.user.tag} left the guild, most likely of their own will.`);
            const { executor, target } = banLog;
            if (target.id === member.id) {
                var executorBan = "UNKNOWN";
            }
            else {
                var executorBan = executor.tag;

            }
            const embed = new Discord.MessageEmbed()
                .setAuthor(`Modlogs`, member.guild.iconURL())
                .setColor("#00ff00")
                .setFooter(member.guild.name, member.guild.iconURL())
                .setTitle("**Moderation** - Member UnBanned")
                .addField("**Member**", `${member.user.tag}`, true)
                .addField("**Executor**", `${executorBan}`, true)
                .addField("**Reason for Ban**", `${banLog.reason}`)
                .setTimestamp();

            member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel")).send({ embeds: [embed] });
            //console.log(`Found log channel and sent message: ${settings.modLogChannel} in ${member.guild.id}`);
            client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${member.guild.name} triggered event: GuildBanRemove Successfully`);

        }
        else {
            //console.log(`member joined guild that has logs disabled!`);
            return;
        }
    }
};
