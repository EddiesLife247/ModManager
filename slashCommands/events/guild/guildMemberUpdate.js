const {
    MessageEmbed,
    Message
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require(`../../handlers/functions`);
const Discord = require(`discord.js`);
module.exports = async (client, oldMember, member) => {
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
    //console.log(oldMember._roles);
    if (member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel"))) {

        // CHECK IF ANY CHANGES
        if (oldMember.nickname == member.nickname) {
            var nicknameChange = `${member.nickname}`;
        } else {
            var nicknameChange = `${oldMember.nickname} > ${member.nickname}`;
        }
        if (oldMember.user.avatar == member.user.avatar) {
            var avatarChange = `${member.user.avatar}`;
        } else {
            var avatarChange = `${oldMember.user.avatar} > ${member.user.avatar}`;
        }
        if (oldMember.user.discriminator == member.user.discriminator) {
            var discriminatorChange = `${member.user.discriminator}`;
        } else {
            var discriminatorChange = `${oldMember.user.discriminator} > ${member.user.discriminator}`;
        }
        if (oldMember.user.username == member.user.username) {
            var usernameChange = `${member.user.username}`;
        } else {
            var usernameChange = `${oldMember.user.username} > ${member.user.username}`;
        }
        if (oldMember._roles == member._roles) {
            var roleChange = `No Role Changes`;
        } else {
            var oldRoles = '';
            oldMember._roles.forEach(roledata => {
                var role = member.guild.roles.cache.find(r => r.id == roledata);
                oldRoles += `${role.name} \n`;

            });
            var newRoles = '';
            member._roles.forEach(roledata => {
                var role = member.guild.roles.cache.find(r => r.id == roledata);
                newRoles += `${role.name} \n`;
            });
        }

        const embed = new Discord.MessageEmbed()
            .setAuthor(`Modlogs`, member.guild.iconURL())
            .setColor("#ff0000")
            .setFooter(member.guild.name, member.guild.iconURL())
            .setTitle("**Moderation** - Member Updated")
            .addField("**Member**", `${member.user.tag}`, true)
            .addField("**Avatar Changes:**", `${avatarChange}`, true)
            .addField("**Username Changes:**", `${usernameChange}`, true)
            .addField("**Discrimintor Changes:**", `${discriminatorChange}`, true)
            .addField("**Nickname Changes:**", `${nicknameChange}`, true)
            .addField(`\u200B`, '\u200B')
            .addField("**Old Roles:**", `${oldRoles}`, true)
            .addField("**New Roles:**", `${newRoles}`, true)
            .setTimestamp();
        if (member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel"))) {
            member.guild.channels.cache.find(c => c.id == client.settings.get(member.guild.id, "logchannel")).send({ embeds: [embed] });
            //client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${member.guild.name} triggered event: GuildMemberUpdate Successfully`);
            //console.log(`Found log channel and sent message: ${settings.modLogChannel} in ${member.guild.id}`);
        } else {
            //console.log(`Cannot find channel: ${settings.modLogChannel} in: ${member.guild.name}`);
        }
    }
    client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${member.guild.name} triggered event: GuildMemberUpdate Successfully`);
};
