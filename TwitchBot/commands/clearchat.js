exports.run = (client, channel, userstate, message, self, args) => {
    const badges = userstate.badges || {};
    const isBroadcaster = badges.broadcaster;
    const isMod = badges.moderator;
    const isModUp = isBroadcaster || isMod;
    if(isModUp) {
        client.clear(channel);
    } else {
        client.say(channel, `Ermm.. This is a moderator only command!`);
    }
}