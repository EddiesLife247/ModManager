module.exports = client => {
    process.on('unhandledRejection', (reason, p) => {
        console.log(' [antiCrash] :: Unhandled Rejection/Catch');
        console.log(reason, p);
        client.guilds.cache.get("787871047139328000").channels.cache.get("902359386796720148").send(`Unhandled Rejection/Catch ERROR detected: ${reason} \`\`\` ${p}\`\`\``);
    });
    process.on("uncaughtException", (err, origin) => {
        console.log(' [antiCrash] :: Uncaught Exception/Catch');
        console.log(err, origin);
        client.guilds.cache.get("787871047139328000").channels.cache.get("902359386796720148").send(`Uncaught Exception/Catch ERROR detected: ${err} \`\`\` ${origin}\`\`\``);
    })
    process.on('uncaughtExceptionMonitor', (err, origin) => {
        console.log(' [antiCrash] :: Uncaught Exception/Catch (MONITOR)');
        console.log(err, origin);
        client.guilds.cache.get("787871047139328000").channels.cache.get("902359386796720148").send(`Uncaught Exception/Catch (MONITOR) ERROR detected: ${err} \`\`\` ${origin}\`\`\``);
    });
    process.on('multipleResolves', (type, promise, reason) => {
        console.log(' [antiCrash] :: Multiple Resolves');
        console.log(type, promise, reason);
        client.guilds.cache.get("787871047139328000").channels.cache.get("902359386796720148").send(` Multiple Resolves ERROR detected: ${reason} \`\`\` ${promise}\`\`\``);
    });
}
