const { MessageEmbed } = require("discord.js");
const User = require("../../Schemas/User");
const emoji = require('../../Utils/emojis');
const Day = require('dayjs')

module.exports = {
  name: "vip",
  description: `[💎] Exibe o status do vip.`,
  options: [
    {
      name: "usuario",
      type: "USER",
      description: "Selecione um usuário.",
      required: false,
    },
  ],

  run: async (client, interaction) => {

    let USER = interaction.options.getUser("usuario") || interaction.user;

    if (USER.bot) {
      return interaction.reply({ content: `**${emoji.Errado} | BOTS não são cadastrados em meu banco de dados!**`, ephemeral: true })
    }

    const user = await User.findOne({ idU: USER.id });

    if (!user) {
      return interaction.reply({ content: `**${emoji.Errado} | Esse usuário não está cadastrado em meu banco de dados! Basta enviar uma mensagem em qualquer canal para registrar.**`, ephemeral: true })
    }

    const vip = user.vip;

    const UwU = new MessageEmbed()
      .setAuthor({ name: `${USER.username} - Vip System`, iconURL: USER.displayAvatarURL({ dynamic: true }) })
      .setColor(process.env.COLOR)
      .addFields(
        { name: `${emoji.Vip} | Possui VIP?`, value: `\`\`\`${vip.hasVip ? "Sim" : "Não"}\`\`\``, inline: false },
        { name: `📆 | Data de Término`, value: `\`\`\`${vip.hasVip ? `${Day(vip.date).format("DD/MM/YYYY HH:MM:ss")}` : "Adquira um VIP"}\`\`\``, inline: false },
      )

    if (!vip.hasVip) {
      return interaction.reply({ embeds: [UwU] });
    } else {
      if (vip.date <= Date.now())
        return interaction.reply({ content: `**${emoji.Errado} | Seu vip expirou e em breve ele será removido!**`, ephemeral: true });

      interaction.reply({ embeds: [UwU] });
    }

  },
};
