const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: "userinfo",
  description: "[🔍] Exibe as informações do usuário.",
  options: [
    {
      name: "usuario",
      type: "USER",
      description: "Selecione o usuário que deseja ver as informações.",
      required: false,
    },
  ],

  run: async (client, interaction) => {
    const flags = {
      DISCORD_EMPLOYEE: "<:d_demployee:993318070095446098>",
      DISCORD_PARTNER: "<:d_partner:993318058674376765>",
      BUGHUNTER_LEVEL_1: "<:d_bughunter1:993318066689687612>",
      BUGHUNTER_LEVEL_2: "<:d_bughunter2:993318068321255495>",
      HYPESQUAD_EVENTS: "<:d_hypesquadevents:993318064143736863>",
      HOUSE_BRAVERY: "<:d_bravery:993318054379388949>",
      HOUSE_BRILLIANCE: "<:d_briliance:993318059974610945>",
      HOUSE_BALANCE: "<:d_balance:993318062558294030>",
      EARLY_SUPPORTER: "<:d_supporter:993318056522690591>",
      VERIFIED_DEVELOPER: "<:d_developer:993318061572620470>",
    };

    const user = interaction.options.getUser("usuario") || interaction.user;
    const userFlags = user.flags.toArray();
    const server = interaction.guild.members.cache.get(user.id);
    let presence;
    if (!server.presence.activities.length) presence = "Nenhum";
    else presence = server.presence.activities.join(", ");

    let embed = new MessageEmbed()
      .setColor(process.env.COLOR)
      .addFields(
        { name: `🖊️ | Nome`, value: `${user.username}`, inline: true },
        { name: "#️⃣ | Tag", value: `${user.discriminator}`, inline: true },
        { name: "🆔 | ID", value: `${user.id}`, inline: true },
        {
          name: "📌 | Status",
          value: `\`\`\`${presence}\`\`\``,
        },
        {
          name: "🗓️ | Conta Criada",
          value: `<t:${Math.ceil(user.createdTimestamp / 1000)}>`,
        },
        {
          name: "🗓️ | Entrada no Servidor",
          value: `<t:${Math.ceil(server.joinedTimestamp / 1000)}:F>`,
        },
        {
          name: "🤖 | Bot?",
          value: `${user.bot ? "Sim" : "Não"}`,
          inline: true,
        },
        {
          name: `🚀 | Server Booster`,
          value: `${server.premiumSince
            ? `Desde <t:${Math.ceil(server.premiumSinceTimestamp / 1000)}>`
            : "Não"
            }`,
          inline: true,
        },
        {
          name: `⚙️ | Cargos`,
          value: `${server.roles.cache
            .sort((a, b) => b.position - a.position)
            .filter((role) => role != interaction.guild.roles.everyone)
            .map((role) => role)
            .join(" ") || `Nenhum`
            }`,
        }
      )
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }));

    if (userFlags.length) {
      embed.setTitle(`${userFlags.map((flag) => flags[flag]).join(" ")}`);
    }

    interaction.reply({ embeds: [embed] });
  },
};
