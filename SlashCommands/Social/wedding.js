const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const User = require('../../Schemas/User')
const Day = require('dayjs')
const emoji = require('../../Utils/emojis');

module.exports = {
  name: "wedding",
  description: "[🔮] Exibe o status do casamento.",
  options: [
    {
      name: "usuario",
      type: "USER",
      description: "Selecione o usuário pelo qual deseja ver o casamento.",
      required: false,
    },
  ],

  run: async (client, interaction) => {
    let user = interaction.options.getUser("usuario") || interaction.user;

    const doc = await User.findOne({
      idU: user.id,
    });

    if (!doc) {
      return interaction.reply({ content: `**${emoji.Errado} | Esse usuário não está cadastrado em meu banco de dados! Basta enviar uma mensagem em qualquer canal para registrar.**`, ephemeral: true });
    }

    if (!doc.marry.has) {
      return interaction.reply({ content: `**${emoji.Errado} | Você ou o usuário não estão casados!**`, ephemeral: true });
    }

    const par = await client.users.fetch(doc.marry.user);

    const EMBED = new MessageEmbed()
      .setColor(process.env.COLOR)
      .setThumbnail(
        par.displayAvatarURL({ dynamic: true, format: "jpg", size: 2048 })
      )
      .setAuthor({ name: `Casamento de ${user.username}` })
      .addFields(
        {
          name: `💍 | Par do Usuário`,
          value: `\`\`\`${par.tag}\`\`\``,
        },
        {
          name: `📆 | Data do Casamento`,
          value: `${Day(doc.marry.time).format("DD/MM/YYYY HH:mm")}\n<t:${~~(doc.marry.time / 1000)}:R>`,
        }
      );

    interaction.reply({ embeds: [EMBED] });
  },
};
