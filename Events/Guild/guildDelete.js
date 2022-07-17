const { MessageEmbed } = require("discord.js");
const client = require("../../index");

client.on("guildDelete", async (guild) => {
  try {

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
      .setTimestamp()


    client.channels.cache.get(process.env.LOGS).send({ embeds: [joined] })
  } catch (err) {
    console.log(err);
  }
});