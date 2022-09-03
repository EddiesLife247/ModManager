//here the event starts
module.exports = (client, error) => {
    console.warn(error);
    client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `A Warning occured: ${error}` });
  }
  /**
    * @INFO
    * Bot Coded by Tomato#6966 | https://discord.gg/FQGXbypRf8
    * @INFO
    * Work for Milrato Development | https://milrato.eu
    * @INFO
    * Please mention him / Milrato Development, when using this Code!
    * @INFO
  */
  