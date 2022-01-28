    exports.run = (client, channel, userstate, message, self, args) => {
        const badges = userstate.badges || {};
        const isBroadcaster = badges.broadcaster;
        const isMod = badges.moderator;
        const isModUp = isBroadcaster || isMod;
        if(isModUp) {
            client.say(channel, `You are a moderator!`);
        } else {
            client.say(channel, `You are not a moderator!`);
        }
    }