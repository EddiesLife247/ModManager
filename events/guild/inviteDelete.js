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
const Discord = require("discord.js");
const SQLite = require("better-sqlite3");
module.exports = async (client, invite) => {
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
        if (client.settings.get(invite.guild.id, "logchannel")) {
            console.log(invite);
            const embed = new Discord.MessageEmbed()
                .setAuthor(`Modlogs`, invite.guild.iconURL())
                .setColor("#00ff00")
                .setFooter(invite.guild.name, invite.guild.iconURL())
                .setTitle("**Moderation** - Invite Deleted")
                .addField("**Code**", `${invite.code}`)
                .addField("**Channel**", `${invite.channel}`)
                .addField("**Created**", `${invite.createdTimestamp}`)
                .addField("**Inviter**", `${invite.inviter}`)
                .setTimestamp();
            // Load the guild's settings
            //console.log(member);
            invite.guild.channels.cache.find(c => c.id == client.settings.get(invite.guild.id, "logchannel")).send({ embeds: [embed] });
            client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${invite.guild.name} triggered event: InviteCreate Successfully`);
            //console.log(`Found log channel and sent message: ${settings.modLogChannel} in ${member.guild.id}`);
        } else {
            //console.log(`Cannot find channel: ${settings.modLogChannel} in: ${member.guild.name}`);
        }
    }
}