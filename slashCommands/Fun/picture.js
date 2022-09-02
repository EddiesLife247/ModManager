const { EmbedBuilder, ApplicationCommandType, PermissionsBitField, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const { get } = require('http');
const https = require('https');
const animals = require('random-animals-api');
module.exports = {
    name: 'picture',
    description: "Picture Time!",
    type: ApplicationCommandType.ChatInput,
    cooldown: 3000,
    options: [
        {
            name: 'category',
            description: 'Choose a picture category.',
            type: 3,
            required: true,
            choices: [
                { name: "cat", value: "Cat", required: true },
                { name: "bunny", value: "Bunny", required: true },
                { name: "dog", value: "Dog", required: true },
                { name: "fox", value: "Fox", required: true },
                { name: "lizard", value: "Lizard", required: true },
                { name: "panda", value: "Panda", required: true },
                { name: "duck", value: "Duck", required: true },
            ],

        }
    ],
    run: async (client, interaction) => {
        if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) {
            const chosenString = interaction.options.getString("category");
            if (chosenString === 'Cat') {
                try {
                    await interaction.deferReply();
                    //const reply = await interaction.editReply("Cat Picture!");
                    let url = "https://aws.random.cat/meow";
                    https.get(url, (res) => {
                        let body = "";
                        res.on("data", (chunk) => {
                            body += chunk;
                        });
                        res.on("end", () => {
                            let json = JSON.parse(body);
                            var link = json[`file`];
                            interaction.editReply(`${link}`);
                        });
                    });

                } catch (err) {
                    console.log(err);
                }
            }
            if (chosenString === 'Bunny') {
                try {
                    await interaction.deferReply();
                    animals.bunny()
                        .then(url => interaction.editReply(`${url}`))
                        .catch((error) => console.error(error));

                } catch (err) {
                    console.log(err);
                }
            }
            if (chosenString === "Dog") {
                await interaction.deferReply();
                let url = "https://dog.ceo/api/breeds/image/random";
                https.get(url, (res) => {
                    let body = "";
                    res.on("data", (chunk) => {
                        body += chunk;
                    });
                    res.on("end", () => {
                        try {
                            let json = JSON.parse(body);
                            interaction.editReply(`${json[`message`]}`);

                        } catch (error) {
                            console.error(error.message);

                        };
                    });

                }).on("error", (error) => {
                    console.error(error.message);
                });
            }
            if (chosenString === "Fox") {
                await interaction.deferReply();
                animals.fox()
                    .then(url => interaction.editReply(`${url}`))
            }
            if (chosenString === "Lizard") {
                await interaction.deferReply();
                animals.lizard()
                    .then(url => interaction.editReply(`${url}`))
            }
            if (chosenString === "Panda") {
                await interaction.deferReply();
                animals.panda()
                    .then(url => interaction.editReply(`${url}`))
            }
            if (chosenString === "Duck") {
                await interaction.deferReply();
                animals.duck()
                    .then(url => interaction.editReply(`${url}`))
            }
        } else {
            interaction.reply({ content: `Sorry, I don't have enough permissions to send messages, run /botcheck for more info!`, ephemeral: true });
        }
    }
};