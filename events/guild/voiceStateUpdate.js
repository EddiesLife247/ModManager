const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionsBitField } = require('discord.js');
const config = require(`../../configs/config.json`);
const Discord = require(`discord.js`);
const SQLite = require("better-sqlite3");
const botsql = new SQLite(`./databases/bot.sqlite`);
const supsql = new SQLite(`./databases/suport.sqlite`);
const rrsql = new SQLite(`./databases/rr.sqlite`);
const bansql = new SQLite(`./databases/bans.sqlite`);
const scresql = new SQLite(`./databases/scores.sqlite`);
module.exports = async (client, oldState, newState) => {
    client.setup = botsql.prepare(`SELECT * FROM settings WHERE guildid = '${oldState.guild.id}'`);
    if (!client.setup.all().length) {
        //console.log(`${oldState.guild.name} - Is not setup!`);
        return;
    }
    if (oldState.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
        try {

            client.logchannel = botsql.prepare(`SELECT logchannel FROM settings WHERE guildid = '${oldState.guild.id}'`);
            if (!client.logchannel.get().logchannel == "") {
                const logchannel = oldState.guild.channels.cache.get(client.logchannel.get().logchannel);
                if(logchannel == null){
                    return;
                }
                //console.log(channel.guild.channels.cache.find(c => c.name == settings.modLogChannel));
                //console.log(`member joined guild that has logs enabled!`);
                var userDetail = client.users.cache.find(user => user.id === oldState.id).tag;
                if (newState.channelId == null) {
                    var channelDetails = oldState.guild.channels.cache.find(c => c.id == oldState.channelId);
                    const embed = new EmbedBuilder();
                    embed.setColor("#ff0000")
                    embed.setTitle('**Moderation** - Member Left Voice Channel');
                    embed.addFields(
                        { name: 'Member', value: `${userDetail}`, inline: false },
                        { name: 'Current Channel', value: `${channelDetails.name}`, inline: false },
                    )
                    embed.setTimestamp();
                    logchannel.send({ embeds: [embed] });
                    console.log(`Memeber Left a voice channel in: ${oldState.guild.name}.`);
                } else {
                    if (oldState.channelId == undefined) {
                        var channelDetails = newState.guild.channels.cache.find(c => c.id == newState.channelId);
                        const embed = new EmbedBuilder();
                        embed.setColor("#00ff00")
                        embed.setTitle('**Moderation** - Member Joined Voice Channel');
                        embed.addFields(
                            { name: 'Member', value: `${userDetail}`, inline: false },
                            { name: 'Current Channel', value: `${channelDetails.name}`, inline: false },
                        )
                        embed.setTimestamp();
                        logchannel.send({ embeds: [embed] });
                        console.log(`Memeber Joined a voice channel in: ${oldState.guild.name}.`);
                    }
                }
            }
        } catch (err) {
            console.log(err);
            client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR: event: ${err.message} | \`\`\` ${err.stack} \`\`\`` });
            return;
        }
    }
}

/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */