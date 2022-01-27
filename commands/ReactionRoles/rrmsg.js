module.exports = {
    minArgs: 1,
    expectedArgs: '[Channel tag] <Message text>',
    name: "rrmsg", //the command name for execution & for helpcmd [OPTIONAL]

    category: "ReactionRoles",
    aliases: ["rrmsge"],
    usage: "rrmsg [channel] <Message Text>",

    cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
    description: "Sends a Message for Reaction Roles!", //the command description for helpcmd [OPTIONAL]
    memberpermissions: ["MANAGE_GUILD "], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    run: async (client, message, args) => {
        client.features.ensure(guild.id, {
			music: true,
			logs: true,
			reactionroles: true,
			moderation: true,
			fun: true,
			youtube: false,
			support: true,
			points: true,
		  });
		if(client.features.get(message.guild.id, "reactionroles") == false) {
			return;
		  }
        const { guild, mentions } = message
        const { channels } = mentions
        const targetChannel = channels.first() || message.channel
        if (channels.first()) {
            args.shift();
        }
        if (!guild.me.permissions.has('MANAGE_MESSAGES')) {
            message.reply("Mod Manager currently cannot manage roles");
            return
        }
        const text = args.join(' ');
        const newMessage = await targetChannel.send(text);

        if (guild.me.permissions.has('MANAGE_MESSAGES')) {
            message.delete();
            message.channel.send(`Message has been sent! \n \n You can add reaction roles to it with Message id: ${newMessage.id}`);
        }

    },
}