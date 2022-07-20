const { MessageEmbed } = require("discord.js");
const Guild = require("../../Schemas/Guild");
const client = require("../../index");

client.on("messageUpdate", async (oldMessage, newMessage) => {

  Guild.findOne({ idS: newMessage.guild.id }, async (err, server) => {
    try {
      if (newMessage.author.bot) return;
      const guild = newMessage.guild;

      if (oldMessage.content === newMessage.content) return;

      client.emit("messageCreate", newMessage);

      const UPDATE = new MessageEmbed()
        .setColor(process.env.COLOR)
        .setTitle(`Mensagem Editada`)
        .addFields(
          {
            name: `👤 | Autor`,
            value: `${newMessage.author}\n\`${newMessage.author.id}\``,
          },
          {
            name: `📥 | Anterior`,
            value: `${oldMessage.content}`,
          },
          {
            name: `📤 | Posterior`,
            value: `${newMessage.content}`,
          },
          {
            name: `✨ | Canal`,
            value: `${newMessage.channel}`,
          }
        )
        .setThumbnail(
          newMessage.author.displayAvatarURL({ dynamic: true, size: 1024 })
        )
        .setTimestamp()

      if (newMessage.attachments.size > 0) {
        const url = newMessage.attachments.map(x => x.attachment)
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