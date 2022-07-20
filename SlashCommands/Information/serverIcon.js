const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const emoji = require('../../Utils/emojis');

module.exports = {
  name: "servericon",
  description: "[🔍] Exibe o ícone do servidor.",

  run: async (client, interaction) => {

    const image = interaction.guild.iconURL({ dynamic: true, size: 1024 });

    if (!image) return interaction.reply({ content: `**${emoji.Errado} | Lamento ${interaction.user}, mas esse servidor não possui ícone!**`, ephemeral: true });

    const icon = new MessageEmbed()
      .setTitle(`🖼️ | Ícone de ${interaction.guild.name}`)
      .setColor(process.env.COLOR)
      .setImage(image);

    const button = new MessageActionRow().addComponents(
      new MessageButton()

        .setStyle("LINK")
        .setEmoji("📥")
        .setLabel("Download")
        .setURL(image)
    );

    interaction.reply({ embeds: [icon], components: [button] });
  },
};
