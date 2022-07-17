require("dotenv").config();
const { Collection, Client, Intents } = require("discord.js");

const client = new Client({
  allowedMentions: {
    parse: ["roles", "users"],
    repliedUser: true,
  },
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_BANS,
    //Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    //Intents.FLAGS.GUILD_INTEGRATIONS,
    //Intents.FLAGS.GUILD_WEBHOOKS,
    //Intents.FLAGS.GUILD_INVITES,
    //Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    //Intents.FLAGS.GUILD_MESSAGE_TYPING,
    //Intents.FLAGS.DIRECT_MESSAGES,
    //Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    //Intents.FLAGS.DIRECT_MESSAGE_TYPING
  ],
});

module.exports = client;

client.aliases = new Collection();
client.SlashCommands = new Collection();
client.interactions = new Collection();

require("./Handler/Handler")(client);

client.login(process.env.TOKEN);
