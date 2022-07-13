const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "serverinfo",
  description: "[🔍] Exibe informações sobre o servidor.",
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const {
      createdTimestamp,
      ownerId,
      description,
      members,
      memberCount,
      channels,
      emojis,
      stickers,
      premiumTier,
      premiumSubscriptionCount,
      roles,
    } = interaction.guild;

    const server = new MessageEmbed()
      .setColor(process.env.COLOR)
      .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
      .addFields(
        { name: `👑 | Dono`, value: `<@${ownerId}>`, inline: true },
        {
          name: `📋 | Informações`,
          value: `
              **Nome:** ${interaction.guild.name}
              **Descrição:** ${description || "Sem descrição"}
              **Servidor Criado:** <t:${parseInt(createdTimestamp / 1000)}:R>
              `,
        },
        {
          name: "👥 | Usuários",
          value: `
            **Total:** ${memberCount}
            **Bots:** ${members.cache.filter((m) => m.user.bot).size}
            **Cargos:** ${roles.cache.size}
            **Usuários:** ${members.cache.filter((m) => !m.user.bot).size}
             
            `,
          inline: true,
        },
        {
          name: "📡 | Canais",
          value: `
            **Total:** ${channels.cache.size}
            **Voz:** ${channels.cache.filter((c) => c.type === "GUILD_VOICE").size
            }
            **Texto:** ${channels.cache.filter((c) => c.type === "GUILD_TEXT").size
            }
            **Threads:** ${channels.cache.filter(
              (c) =>
                c.type === "GUILD_NEWS_THREAD" &&
                "GUILD_PUBLIC_THREAD" &&
                "GUILD_PRIVATE_THREAD"
            ).size
            }
             
            `,
          inline: true,
        },
        {
          name: "📦 | Emojis & Stickers",
          value: `
                **Total:** ${stickers.cache.size + emojis.cache.size}
                **Animado:** ${emojis.cache.filter((e) => e.animated).size}
                **Estático:** ${emojis.cache.filter((e) => !e.animated).size}
                **Stickers:** ${stickers.cache.size}
                `,
          inline: true,
        },
        {
          name: "🚀 | Nitro",
          value: `
                **Nível:** ${premiumTier.replace("TIER_", "")}
                **Boosts:** ${premiumSubscriptionCount}
                **Boosters:** ${members.cache.filter((m) => m.premiumSince).size
            }
                `,
        }
      );

    interaction.reply({ embeds: [server] });
  },
};
