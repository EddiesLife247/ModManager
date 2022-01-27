const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require("../../handlers/functions");
const { logMessage } = require(`../../handlers/newfunctions`);
const SQLite = require("better-sqlite3");
const rrsql = new SQLite(`./databases/rr.sqlite`);
const Discord = require("discord.js");
module.exports = async (client, reaction, user) => {
    try {
    client.features.ensure(reaction.guildId, {
        music: true,
        logs: true,
        reactionroles: true,
        moderation: true,
        fun: true,
        youtube: false,
        support: true,
        points: true,
    });
    if (client.features.get(reaction.guildId, "reactionroles") == false) {
        return;
    }
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
        await reaction.message.guild.members.cache.get(user.id).roles.remove(rr.role)
        logMessage(client, "success", message.guild, `Message Reaction Remove`);
        //do nothing.


    }
    let emojicheck = `<:${reaction.emoji.name}:${reaction.emoji.id}>`
    // CHECK IF reaction role is added by non standard emoji
    rr2 = client.getRr.get(emojicheck, reaction.message.guildId, reaction.message.channelId, reaction.message.id);
    if (rr2) {
        // console.log("WOOHOO!!! NON STANDARD EMOJI DETECTED");
        // DO SOMETHING WITH REACTION!
        //console.log(reaction);

        await reaction.message.guild.members.cache.get(user.id).roles.remove(rr2.role)
        logMessage(client, "success", message.guild, `Message Reaction Remove`);


    }
} catch (e) {
    const { logMessage } = require(`../../handlers/newfunctions`);
    logMessage(client, `error`, reaction.message.guild, `Error with REACTION REMOVE event: ${e.message} | ${e.stack}`);
}
};
