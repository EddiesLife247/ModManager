const SQLite = require("better-sqlite3");
const sql = new SQLite(`./databases/scores.sqlite`);
const request = require('request');
module.exports = {
    name: "trivia", //the command name for execution & for helpcmd [OPTIONAL]

    category: "Fun",
    aliases: [],
    usage: "triva",

    cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
    description: "Gets the next trivia question manually", //the command description for helpcmd [OPTIONAL]
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    run: async (client, message, args) => {
        try {
        const options = {
            method: 'GET',
            url: 'https://trivia-by-api-ninjas.p.rapidapi.com/v1/trivia',
            headers: {
                'x-rapidapi-host': 'trivia-by-api-ninjas.p.rapidapi.com',
                'x-rapidapi-key': 'e0980a2f6emshbf207eddf0a785ep128763jsn5fc56351a0d0',
                useQueryString: true
            }
        };
        try {
            request(options, function (error, response, body) {
                //if (error) throw new Error(error);
                let json = JSON.parse(body);
                //console.log(json);
                message.channel.send(`Random Question: :${json[0]['question']} \n \n To see the answer click: ||${json[0]['answer']}||`);
            });

        }
        catch (err) {
            console.log(err);
            message.reply("There was an error.. report this via !report <message>")
        }
    } catch (err) {
        const { logMessage } = require(`../../handlers/newfunctions`);
        logMessage(client, `error`, message.guild, `Error with TRANSLATE command: \${err.message} | \`\`\` ${err.stack} \`\`\``);
     
    }
}
};
// You can modify the code below to remove points from the mentioned user as well!


