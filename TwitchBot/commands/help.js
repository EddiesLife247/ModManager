exports.run = (client, channel, userstate, message, self, args) => {
    var fs = require('fs');
    var files = fs.readdirSync(`./TwitchBot/commands/`);
    console.log(files);
    var cmds = "";
    var ModCmds = "";
    files.forEach(function (file) {
        console.log(file);
        str = file.slice(0, -3);
        cmds = cmds + '?' + str + ', ';
    });
    client.say(channel, `Commands available are: ?discord, !lurk, !unlurk, 'hello', ${cmds}`)
}