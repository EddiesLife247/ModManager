const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require("../../handlers/functions");
const SQLite = require("better-sqlite3");
const rrsql = new SQLite(`./databases/rr.sqlite`);
const Discord = require("discord.js");
module.exports = async (client, reaction, user) => {
    //console.log(user);
    if (user.bot) {
        //DO NOTHING
        return;
    }
    client.settings.ensure(reaction.message.guildId, {
        prefix: config.prefix,
        defaultvolume: 50,
        defaultautoplay: false,
        defaultfilters: [`bassboost6`, `clear`],
        djroles: [],
        botchannel: [],
        logchannel: [],
        topicmodlogs: true,
        randomtopic: [],
        qotdchannel: [],
        levelupchan: [],
        swearfilter: false,
        urlfilter: false,
        invitefilter: false,
        supportTeamId: [],
    })
    //console.log(`${user.tag} reacted ${reaction.emoji.name} on message ${reaction.message.id}.`);
    client.getRr = rrsql.prepare("SELECT * FROM rrtable WHERE emoji = ?  AND guild = ? AND channel = ? AND messageid = ?");
    client.addRr = rrsql.prepare("INSERT OR REPLACE INTO rrtable (id, emoji, guild, role, messageid, channel) VALUES (@id, @emoji, @guild, @role, @messageid, @rrchan);");
    client.removeRr = rrsql.prepare("DELETE FROM rrtable WHERE emoji = ? AND guild = ? AND channel = ?");
    //console.log(reaction.message.id);
    //return;
    let rr;
    rr = client.getRr.get(reaction.emoji.name, reaction.message.guildId, reaction.message.channelId, reaction.message.id);
    if (rr) {
        //console.log("WOOHOO!!!");
        // DO SOMETHING WITH REACTION!
        //console.log(reaction);
        await reaction.message.guild.members.cache.get(user.id).roles.add(rr.role)
    }
    let emojicheck = `<:${reaction.emoji.name}:${reaction.emoji.id}>`
    // CHECK IF reaction role is added by non standard emoji
    rr2 = client.getRr.get(emojicheck, reaction.message.guildId, reaction.message.channelId, reaction.message.id);
    if (rr2) {
        //console.log("WOOHOO!!! NON STANDARD EMOJI DETECTED");
        // DO SOMETHING WITH REACTION!
        //console.log(reaction);
        await reaction.message.guild.members.cache.get(user.id).roles.add(rr2.role)
    }

    // SUPPORT DESK MODULE

    //console.log(reaction);
    const supportTeamId = client.settings.get(reaction.message.guild.id, `supportTeamId`);
    //console.log(reaction.message.id);
    let guildId = reaction.message.guild.id;
    const supsql = new SQLite(`./databases/support.sqlite`);
    client.getSupport = supsql.prepare("SELECT * FROM tickets WHERE initmsg = ?  AND guild = ?");
    client.addSupport = supsql.prepare("INSERT OR REPLACE INTO tickets (id, user, guild, initmsg, subject, status) VALUES (@id, @user, @guild, @initmsg, @subject, @status);");

    let ticket;
    ticket = client.getSupport.get(reaction.message.id, guildId);
    //console.log(ticket);
    if (ticket) {
        let emoji = reaction.emoji.name;
        //console.log(reaction.emoji.name);
        //console.log(reaction.message.channelId)
        const channel = client.guilds.cache.get(guildId).channels.cache.get(reaction.message.channelId);
        const guild = client.guilds.cache.get(guildId);
        const everyoneId = guild.roles.everyone.id;
        const userId = ticket.user;
        const ticketId = ticket.id;
        const subject = ticket.subject;
        let status = "";

        //console.log(client.guilds.cache.get(guildId).channels.cache.get(reaction.message.channelId));
        channel.permissionOverwrites.create(channel.guild.roles.everyone, { VIEW_CHANNEL: false });
        if (emoji == '🔒') {

            if (supportTeamId == undefined) {
                channel.permissionOverwrites.create(userId, { VIEW_CHANNEL: true, SEND_MESSAGES: false });
            } else {
                channel.permissionOverwrites.create(userId, { VIEW_CHANNEL: true, SEND_MESSAGES: false });
                channel.permissionOverwrites.create(supportTeamId, { VIEW_CHANNEL: true, SEND_MESSAGES: false });
            }
            return reaction.message.reactions.removeAll().then(msg => {
                msg.react('🔓');
                msg.react('❌');
                channel.send("This ticket has been locked, Unlock this ticket to continue.");
                status = 'Closed';
                score = { id: ticket.id, user: userId, guild: guild.id, initmsg: msg.id, subject: subject, status: status }
                client.addSupport.run(score);
            });
        }
        else if (emoji == '🔓') {
            if (supportTeamId == undefined) {
                channel.permissionOverwrites.create(userId, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
            } else {
                channel.permissionOverwrites.create(userId, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
                channel.permissionOverwrites.create(supportTeamId, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
            }
            return reaction.message.reactions.removeAll().then(msg => {
                msg.react('🔒');
                msg.react('❌');
                channel.send("This ticket has been unlocked.");
                status = 'Open';
                score = { id: ticket.id, user: userId, guild: guild.id, initmsg: msg.id, subject: subject, status: status }
                client.addSupport.run(score);
            });
        }
        else if (emoji == '❌') {
            let msg = channel;
            return channel.delete().then(c => {
                status = 'Closed / Deleted';
                score = { id: ticket.id, user: userId, guild: guild.id, initmsg: msg.id, subject: subject, status: status }
                client.addSupport.run(score);
            });
        }
    }
    client.guilds.cache.get("787871047139328000").channels.cache.get("895353584558948442").send(`\n \n ${reaction.message.guild.name} triggered event: messageReactionAdd Successfully`);
};