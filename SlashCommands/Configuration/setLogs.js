const Guild = require("../../Schemas/Guild");
const emoji = require('../../Utils/emojis');

module.exports = {
  name: "setlogs",
  description: "[⚙] Configura o canal de logs.",
  userPermissions: ["MANAGE_MESSAGES"],
  botPermissions: ["MANAGE_MESSAGES"],
  options: [
    {
      name: "canal",
      type: "CHANNEL",
      description: "Selecione um canal.",
      required: true,
    },
  ],

  run: async (client, interaction) => {
    let logs = interaction.options.getChannel("canal");

    const server = await Guild.findOne({
      idS: interaction.guild.id,
    });

    if (!logs.isText() || logs.isVoice()) {
      return interaction.reply({ content: `${emoji.Errado}| **O canal deve ser um canal de texto!**`, ephemeral: true })
    }

    if (logs.id == server.logs.channel) {
      return interaction.reply({ content: `${emoji.Errado}| **Esse canal é o mesmo setado atualmente!**`, ephemeral: true })
    } else {
      interaction.reply(`${emoji.Certo}| O canal **<#${logs.id}>**, foi setado como canal de **logs** com sucesso!`);
      await Guild.findOneAndUpdate(
        { idS: interaction.guild.id },
        { $set: { "logs.channel": logs.id } }
      );
    }

  },
};
