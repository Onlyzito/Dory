const { MessageEmbed } = require("discord.js");
const Guild = require("../../Schemas/Guild");
const client = require("../../index");

client.on("messageDelete", async (message) => {
  Guild.findOne({ idS: message.guild.id }, async function (err, server) {
    try {
      if (message.author.bot == true) return;
      const guild = message.guild;

      const UPDATE = new MessageEmbed()
        .setColor(process.env.COLOR)
        .setTitle(`Mensagem Deletada`)
        .addFields(
          {
            name: `👤 | Autor`,
            value: `${message.author}\n\`${message.author.id}\``,
          },
          {
            name: `✨ | Canal`,
            value: `${message.channel}`,
          }
        )
        .setThumbnail(
          message.author.displayAvatarURL({ dynamic: true, size: 1024 })
        )
        .setTimestamp()

      if (message.content) {
        UPDATE.addFields({ name: "Mensagem", value: `${message.content}`, inline: false })
      }

      if (message.attachments.size > 0) {
        const url = message.attachments.map(x => x.attachment)
        UPDATE.setDescription(`[Baixar](${url})`)
        UPDATE.setImage(`${url}`)
      }

      if (server.logs.status) {
        const channel = guild.channels.cache.get(server.logs.channel);
        channel.send({ embeds: [UPDATE] });
      }
    } catch (err) {
      console.log(err);
    }
  });
});