const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: "avatar",
  description: "[🔍] Exibe o avatar do usuário.",
  options: [
    {
      name: "usuario",
      type: "USER",
      description: "Selecione um usuário.",
      required: false,
    },
  ],

  run: async (client, interaction) => {
    let user = interaction.options.getUser("usuario") || interaction.user;

    const button = new MessageButton()
      .setEmoji("📥")
      .setLabel("Download")
      .setStyle("LINK")
      .setURL(
        user.displayAvatarURL({ dynamic: true, format: "png", size: 4096 })
      );

    const row = new MessageActionRow().addComponents(button);
    const avatar = new MessageEmbed()
      .setDescription(`**🖼️ | Avatar de ${user}**`)
      .setColor(process.env.COLOR)
      .setImage(
        user.displayAvatarURL({ dynamic: true, format: "png", size: 4096 })
      );
    interaction.reply({ embeds: [avatar], components: [row] });
  },
};
