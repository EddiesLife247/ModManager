const fs = require("fs");
const allevents = [];
const chalk = require('chalk')
var AsciiTable = require('ascii-table');
const { kill } = require("process");
var table = new AsciiTable()
table.setHeading('Events', 'Stats').setBorder('|', '=', "0", "0")

/*
module.exports = (client) => {
    fs.readdirSync('./events/').filter((file) => file.endsWith('.js')).forEach((event) => {
      	require(`../events/${event}`);
	table.addRow(event.split('.js')[0], '✅')
    })
	console.log(chalk.greenBright(table.toString()))
};
*/
module.exports = async (client) => {
    try {
        let amount = 0;
        const load_dir = (dir) => {
            const event_files = fs.readdirSync(`./events/${dir}`).filter((file) => file.endsWith(".js"));
            for (const file of event_files) {
                try {
                    const event = require(`../events/${dir}/${file}`)
                    let eventName = file.split(".")[0];
                    allevents.push(eventName);
                    client.on(eventName, event.bind(null, client));
                    amount++;
					//console.log(`${eventName} Loaded`);
                } catch (e) {
                    console.log(e)
                }
            }
        }
        await ["client", "guild"].forEach(e => load_dir(e));
        console.log(`${amount} Events Loaded`);
    } catch (e) {
        console.error(e.stack);
        client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `EVENT HANDLER ERROR | ${e} | \`\`\` ${e.stack} \`\`\`` });
		kill();
    }
};