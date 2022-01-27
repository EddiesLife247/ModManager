//Import Modules
const {
    MessageButton,
    MessageActionRow,
    MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require("../../handlers/functions");
const { logMessage } = require(`../../handlers/newfunctions`);
const Discord = require("discord.js");
const SQLite = require("better-sqlite3");
module.exports = async (client, invite) => {
    try {
    client.features.ensure(invite.guild.id, {
        music: true,
        logs: true,
        reactionroles: true,
        moderation: true,
        fun: true,
        youtube: false,
        support: true,
        points: true,
    });
    if (client.features.get(invite.guild.id, "logs") == false) {
        return;
    }
    const guild = invite.guild;
    if (guild.me.permissions.has("VIEW_AUDIT_LOG")) {
        client.settings.ensure(invite.guild.id, {
            prefix: config.prefix,
            defaultvolume: 50,
            defaultautoplay: false,
            defaultfilters: [`bassboost6`, `clear`],
            djroles: [],
            botchannel: [],
            logxhannel: [],
        })
        if (invite.guild.channels.cache.find(c => c.id == client.settings.get(invite.guild.id, "logchannel"))) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`Modlogs`, invite.guild.iconURL())
                .setColor("#00ff00")
                .setFooter(invite.guild.name, invite.guild.iconURL())
                .setTitle("**Moderation** - Invite Created")
                .addField("**Code**", `${invite.code}`)
                .addField("**Invitee**", `${invite.inviter}`)
                .addField("**Uses**", `${invite.uses} of ${invite.maxUses === 0 ? "∞" : invite.maxUses}`)
                .addField("**Expires**", `${invite.maxAge
                    ? new Date(invite.createdTimestamp + invite.maxAge * 1000).toLocaleString()
                    : "never"
                    }`)
                .setTimestamp();
            // Load the guild's settings
            //console.log(member);
            if (invite.guild.channels.cache.find(c => c.id == client.settings.get(invite.guild.id, "logchannel"))) {
                invite.guild.channels.cache.find(c => c.id == client.settings.get(invite.guild.id, "logchannel")).send({ embeds: [embed] });
            }
            logMessage(client, "success", invite.guild, `New Invite Code Created`);
            //console.log(`Found log channel and sent message: ${settings.modLogChannel} in ${member.guild.id}`);
        } else {
            //console.log(`Cannot find channel: ${settings.modLogChannel} in: ${member.guild.name}`);
        }
    }
} catch (e) {
    const { logMessage } = require(`../../handlers/newfunctions`);
    logMessage(client, `error`, invite.guild, `Error with INVITE CREATE event: ${e.message} | ${e.stack}`);
}
}