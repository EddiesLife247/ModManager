module.exports = client => {
    process.on('unhandledRejection', (reason, p) => {
        console.log(' [antiCrash] :: Unhandled Rejection/Catch');
        console.log(reason, p);
        client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `[antiCrash] :: Unhandled Rejection/Catch: ${reason} | \`\`\` ${p} \`\`\`` });
    });
    process.on("uncaughtException", (err, origin) => {
        console.log(' [antiCrash] :: Uncaught Exception/Catch');
        console.log(err, origin);
        client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `[antiCrash] :: Unhandled Exception/Catch: ${reason} | \`\`\` ${origin} \`\`\`` });
    })
    process.on('uncaughtExceptionMonitor', (err, origin) => {
        console.log(' [antiCrash] :: Uncaught Exception/Catch (MONITOR)');
        console.log(err, origin);
        client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `[antiCrash] :: Uncaught Exception/Catch (MONITOR) ${reason} | \`\`\` ${origin} \`\`\`` });
    });
    process.on('multipleResolves', (type, promise, reason) => {
        console.log(' [antiCrash] :: Multiple Resolves');
        console.log(type, promise, reason);
        client.guilds.cache.get("787871047139328000").channels.cache.get("901905815810760764").send({ content: `[antiCrash] :: Uncaught Exception/Catch (MONITOR) ${type} | ${reason} | \`\`\` ${promise} \`\`\`` });
    });
    //test github
}
