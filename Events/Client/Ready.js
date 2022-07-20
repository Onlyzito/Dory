const chalk = require("chalk");
const client = require("../../index");
const { connect } = require("mongoose");

client.on("ready", async () => {

  client.user.setActivity(`/help | 🙋‍♀️`, { type: "PLAYING" });

  console.clear();
  console.log(chalk.red(`${client.user.username}`), chalk.white(`online.`));
  connect(process.env.MONGO).then(
    console.log(chalk.red("Connected on"), chalk.white(`MongoDB.`))
  );
});
