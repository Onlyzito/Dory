const Guild = require('../../Schemas/Guild');
const emoji = require('../../Utils/emojis');

module.exports = {
  name: "anti",
  description: "[⚙] Ativa ou desativa o AntiFake.",
  options: [
    {
      name: "escolher",
      type: "BOOLEAN",
      description: "Escolha se deseja ligar ou desligar.",
      required: true,
    },
  ],

  run: async (client, interaction) => {
    let escolha = interaction.options.getBoolean("escolher")

    const server = await Guild.findOne({
      idS: interaction.guild.id,
    });

    const anti = server.antifake;

    if (escolha == true) {
      if (anti.days <= 1)
        return interaction.reply({ content: `${emoji.Errado}| Para ativar o sistema de AntiFake você precisa setar os dias antes! **Use \`/setanti\`**`, ephemeral: true });

      if (anti.status)
        return interaction.reply({ content: `${emoji.Errado}| **O sistema já se encontra ativo!**`, ephemeral: true });

      interaction.reply(`${emoji.Certo}| Sistema de **AntiFake** ativo com sucesso.`);
      await Guild.findOneAndUpdate(
        { idS: interaction.guild.id },
        { $set: { "antifake.status": true } }
      );

    }

    if (escolha == false) {
      if (!anti.status)
        return interaction.reply({ content: `${emoji.Errado}| **O sistema já se encontra desativado!**`, ephemeral: true });

      interaction.reply(`${emoji.Certo}| Sistema de **AntiFake** desativado com sucesso.`);
      await Guild.findOneAndUpdate(
        { idS: interaction.guild.id },
        { $set: { "antifake.status": false } }
      );
    }
  },
};
