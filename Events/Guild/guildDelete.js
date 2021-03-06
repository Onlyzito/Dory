const { MessageEmbed } = require("discord.js");
const client = require("../../index");

client.on("guildDelete", async (guild) => {
  try {
    
    const very = client.channels.cache.get(process.env.LOGS);
    if(!very) return;

    const owner = await guild.fetchOwner()

    const joined = new MessageEmbed()
      .setColor("RED")
      .setAuthor({ name: `${client.user.username} - Saída Servidor.`, iconURL: client.user.displayAvatarURL() })
      .addFields(
        {
          name: `🌍 | Servidor`,
          value: `${guild.name}`,
          inline: true,
        },
        {
          name: `👑 | Dono`,
          value: `${owner}`,
          inline: true,
        },
        {
          name: `👤 | Usuários`,
          value: `${guild.memberCount}`,
          inline: true,
        },
        {
          name: `🆔 | ID Dono`,
          value: `\`${owner.id}\``,
          inline: false,
        },
        {
          name: `🆔 | ID Servidor`,
          value: `\`${guild.id}\``,
          inline: false,
        },
      )
      .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
      .setFooter({ text: `Saída`, iconURL: guild.iconURL({ dynamic: true }) })
      .setTimestamp()


    very.send({ embeds: [joined] })
  } catch (err) {
    console.log(err);
  }
});
