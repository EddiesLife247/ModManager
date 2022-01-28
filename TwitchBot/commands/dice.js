exports.run = (client, channel, userstate, message, self, args) => {
    const num = rollDice();
    client.say(channel, `You rolled a ${num}`);
    logMessage(`Channel : ${channel} : dice comamnd`);
}

    function rollDice() {
        const sides = 6;
        return Math.floor(Math.random() * sides) + 1;
    }