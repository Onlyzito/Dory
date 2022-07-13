const chalk = require("chalk");
const client = require("../index");
const { connect } = require("mongoose");

client.on("ready", async () => {
  const budapeste = client.guilds.cache.size;
  client.user.setActivity(`/help | ${budapeste}`, { type: "WATCHING" });

  console.clear();
  console.log(chalk.red(`${client.user.username}`), chalk.white(`online.`));
  connect(process.env.MONGO).then(
    console.log(chalk.red("Connected on"), chalk.white(`MongoDB.`))
  );
});
