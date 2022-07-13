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
      DISCORD_EMPLOYEE: "SEU EMOJI",
      DISCORD_PARTNER: "SEU EMOJI",
      BUGHUNTER_LEVEL_1: "SEU EMOJI",
      BUGHUNTER_LEVEL_2: "SEU EMOJI",
      HYPESQUAD_EVENTS: "SEU EMOJI",
      HOUSE_BRAVERY: "SEU EMOJI",
      HOUSE_BRILLIANCE: "SEU EMOJI",
      HOUSE_BALANCE: "SEU EMOJI",
      EARLY_SUPPORTER: "SEU EMOJI",
      VERIFIED_DEVELOPER: "SEU EMOJI",
    };

    const user = interaction.options.getUser("usuario") || interaction.user;
    const userFlags = user.flags.toArray();
    const server = interaction.guild.members.cache.get(user.id);

    let embed = new MessageEmbed()
      .setColor(process.env.COLOR)
      .addFields(
        { name: `🖊️ | Nome`, value: `${user.username}`, inline: true },
        { name: "#️⃣ | Tag", value: `${user.discriminator}`, inline: true },
        { name: "🆔 | ID", value: `${user.id}`, inline: true },
        {
          name: "📌 | Status",
          value: `\`\`\`${server.presence?.activities[0]?.state || "Nenhum"
            }\`\`\``,
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
          value: `${user.premiumSince
              ? `Since <t:${Math.ceil(user.premiumSinceTimestamp / 1000)}:F>`
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
