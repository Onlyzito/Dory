const User = require("../../Schemas/User");
const emoji = require('../../Utils/emojis');
const ms = require("ms")

module.exports = {
  name: "vipadd",
  description: "[👑] Adicionar VIP ao usuário.",
  ownerOnly: true,
  options: [
    {
      name: "usuario",
      type: "USER",
      description: "Selecione um usuário.",
      required: true,
    },
    {
      name: "tempo",
      type: "STRING",
      description: "Informe o tempo.",
      required: true,
    },
  ],

  run: async (client, interaction) => {
    let USER = interaction.options.getUser("usuario") || interaction.user;
    let tempo = interaction.options.getString("tempo");

    const user = await User.findOne({ idU: USER.id });
    const vip = user.vip;
    const time = ms(tempo)

    if (String(time) == "undefined") {
      return interaction.reply({ content: `**Tempo inválido.\nExemplo: \`/vipadd @dory 30d\`**`, ephemeral: true });
    } else {
      if (vip.hasVip) {
        interaction.reply({ content: `${emoji.Certo}| **VIP atribuido com sucesso!**` });
        return await User.findOneAndUpdate(
          { idU: USER.id },
          { $set: { "vip.date": vip.date + time } }
        );
      } else {
        interaction.reply({ content: `${emoji.Certo}| **VIP atribuido com sucesso!**` });
        await User.findOneAndUpdate(
          { idU: USER.id },
          { $set: { "vip.date": Date.now() + time, "vip.hasVip": true } }
        );
      }
    }


  },
};
