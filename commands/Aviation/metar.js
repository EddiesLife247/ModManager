var https = require('https');
const Discord = require('discord.js');
module.exports = {
	name: "metar", //the command name for the Slash Command
	category: "Aviation",
	usage: "metar ICAO",
	aliases: ["met"],
	description: "Gets Weather Metar Information", //the command description for Slash Command Overview
	cooldown: 15,
	requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
	alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
	run: async (client, message, args) => {
		try {
		console.log(`METAR for ${args} by ${message.author.tag}`);
		let argz = args.map(e => e.toUpperCase());
		console.log(argz);
		let url = `https://avwx.rest/api/metar/${argz}?options=info,translate,speech&token=I6DF0eFZdyAOfL6th2UVZsAWb_Cei_iAurasC8hVN7o`;
		console.log(url);
		https.get(url, (res) => {
			let body = "";
			res.on("data", (chunk) => {
				body += chunk;
			});
			res.on("end", () => {
				try {
					let json = JSON.parse(body);
					// do something with JSON
					let MetaEmbed = new Discord.MessageEmbed()
						.setTitle(`${argz} METAR INFORMATON`)
						.addField('Name: ', `> ${json["info"]["name"]}`, true)
						.addField('Type: ', `> ${json["info"]["type"]}`, true)
						.addField('Web: ', `> ${json["info"]["website"]}`, true)
						.addField('City: ', `>  ${json["info"]["city"]}`, true)
						.addField('Country: ', `>  ${json["info"]["country"]}`, true)
						.addField('Elevation in Feet: ', `>  ${json["info"]["elevation_ft"]}`, true)
						.addField('Elevation in Meters: ', `>  ${json["info"]["elevation_m"]}`, true)
						.addField('Clouds: ', `>  ${json["translate"]["clouds"]}`, true)
						.addField('Weather: ', `>  ${json["translate"]["wx_codes"]}`, true)
						.addField('Visibility: ', `>  ${json["translate"]["visibility"]}`, true)
						.addField('Wind: ', `> ${json["translate"]["wind"]}`, true)
						.addField('Temperature: ', `>  ${json["translate"]["temperature"]}`, true)
						.addField('Altimeter: ', `>  ${json["altimeter"]["spoken"]}`, true)
						.addField('Raw Data', `>  ${json["raw"]}`, true)
						.setColor([0, 255, 0])
					//.setURL(json[`info`][`website`]);
					message.channel.send({ embeds: [MetaEmbed] });

				} catch (error) {
					console.error(error.message);
					message.reply(error.message);
				};
			});

		}).on("error", (error) => {
			console.error(error.message);
		});
	} catch (err) {
		const { logMessage } = require(`../../handlers/newfunctions`);
		logMessage(client, `error`, message.guild, `Error with METAR command: \${err.message} | \`\`\` ${err.stack} \`\`\``);
	}
	},
};