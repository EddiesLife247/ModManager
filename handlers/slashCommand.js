const fs = require('fs');
const chalk = require('chalk');

const { PermissionsBitField } = require('discord.js');
const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest')

const AsciiTable = require('ascii-table');
const table = new AsciiTable().setHeading('Slash Commands', 'Stats').setBorder('|', '=', "0", "0")

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const rest = new REST({ version: '10' }).setToken(TOKEN);

module.exports = (client) => {
	const slashCommands = []; 

	fs.readdirSync('./slashCommands/').forEach(async dir => {
		const files = fs.readdirSync(`./slashCommands/${dir}/`).filter(file => file.endsWith('.js'));

		for(const file of files) {
				const slashCommand = require(`../slashCommands/${dir}/${file}`);
				slashCommands.push({
					name: slashCommand.name,
					description: slashCommand.description,
					type: slashCommand.type,
					options: slashCommand.options ? slashCommand.options : null,
					default_permission: slashCommand.default_permission ? slashCommand.default_permission : null,
					default_member_permissions: slashCommand.default_member_permissions ? PermissionsBitField.resolve(slashCommand.default_member_permissions).toString() : null
				});
			
				if(slashCommand.name) {
						client.slashCommands.set(slashCommand.name, slashCommand)
						table.addRow(file.split('.js')[0], '✅')
				} else {
						table.addRow(file.split('.js')[0], '⛔')
				}
		}
		
	});
	console.log(chalk.red(table.toString()));
    (async () => {
        try {
            console.log(`Started refreshing ${slashCommands.length} application (/) commands.`);
			client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `LOADING SLASH COMMANDS` });
    
            await rest.put(
                Routes.applicationCommands(CLIENT_ID),
                { body: slashCommands },
            );
			client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `REFRESHED SLASH COMMANDS` });
            console.log(`Successfully reloaded ${slashCommands.length} application (/) commands.`);
        } catch (error) {
			client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `ERROR LOADING SLASH COMMANDS \`\`\` ${error.stack} \`\`\`` });
            console.error(error);
        }
    })();
};