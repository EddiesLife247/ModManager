exports.run = (client, channel, userstate, message, self, args) => {
        try {
            client.join($arg[0]);
            console.log(`Joined the channel: ${arg[0]}`);
            client.say(channel, `Joined the channel: ${arg[0]}`)
        } catch (e) {
            console.log(e);
        }
}