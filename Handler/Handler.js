const { Client } = require("discord.js");
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const chalk = require("chalk");

/**
 * @param {Client} client
 */
module.exports = async (client) => {
  const slashCommands = [];
  const SlashCommandsFiles = await globPromise(
    `${process.cwd()}/SlashCommands/*/*.js`
  );

  SlashCommandsFiles.map(async (path) => {
    const file = require(path);
    if (!file?.name) return;
    const splitted = path.split("/");
    const dir = splitted[splitted.length - 2];
    const files = {
      dir,
      ...file,
    };
    client.SlashCommands.set(file.name, files);
    slashCommands.push(file);
  });
  client.on("ready", async () => {
    /*await client.guilds.cache
      .get(process.env.GUILD_ID)
      .commands.set(slashCommands)
      .then(
        console.log(
          chalk.white(`✅ Successfully Registered`),
          chalk.red(client.SlashCommands.size),
          chalk.white("Slash Commands in"),
          chalk.red(client.guilds.cache.size),
          chalk.white(`${client.guilds.cache.size > 1 ? "Guilds" : "Guild"}`)
        )
      );*/

    await client.application.commands.set(slashCommands);
  });

  const eventFiles = await globPromise(`${process.cwd()}/Events/*/*.js`);
  eventFiles.map(async (filePaths) => require(filePaths));
};
