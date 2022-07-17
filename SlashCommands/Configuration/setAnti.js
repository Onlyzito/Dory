const Guild = require('../../Schemas/Guild');
const emoji = require('../../Utils/emojis');

module.exports = {
  name: "setanti",
  description: "[⚙] Configura o AntiFake.",
  userPermissions: ["MANAGE_MESSAGES"],
  botPermissions: ["MANAGE_MESSAGES"],
  options: [
    {
      name: "dias",
      type: "NUMBER",
      description: "Informe a quantia de dias que deseja(1-30).",
      required: true,
    },
  ],

  run: async (client, interaction) => {
    let days = interaction.options.getNumber("dias")

    const server = await Guild.findOne({
      idS: interaction.guild.id,
    });

    const anti = server.antifake;

    if (days < 1 || days > 30)
      return interaction.reply({ content: `${emoji.Errado}| **Você precisa informar uma quantia entre 1 e 30 dias!**`, ephemeral: true });

    if (anti.days === days)
      return interaction.reply({ content: `${emoji.Errado}| **A quantia informada é a mesma setada atualmente!**`, ephemeral: true });

    interaction.reply(`${emoji.Certo}| Dias alterado com sucesso.`);

    await Guild.findOneAndUpdate(
      { idS: interaction.guild.id },
      { $set: { "antifake.days": days } }
    );

  },
};
