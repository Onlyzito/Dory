const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const User = require('../../Schemas/User')
const emoji = require('../../Utils/emojis');

module.exports = {
  name: "divorce",
  description: "[🔮] Cancela o casamento.",

  run: async (client, interaction) => {
    const doc = await User.findOne({
      idU: interaction.member.id,
    });

    if (!doc.marry.has) {
      return interaction.reply({ content: `**${emoji.Errado} | Você não está casado!**` });
    }

    const row = new MessageActionRow();

    const yesButton = new MessageButton()
      .setCustomId("yes")
      .setLabel("Confirmar")
      .setStyle("SUCCESS")
      .setDisabled(false);

    const noButton = new MessageButton()
      .setCustomId("no")
      .setLabel("Cancelar")
      .setStyle("DANGER")
      .setDisabled(false);

    row.addComponents([yesButton, noButton]);

    const transf = new MessageEmbed()
      .setColor(process.env.COLOR)
      .setTitle(`Divórcio...`)
      .setDescription(
        `você realmente deseja se divorciar de ${await client.users
          .fetch(doc.marry.user)
          .then((x) => x)}?`
      );

    const msg = await interaction.reply({ embeds: [transf], components: [row], fetchReply: true });

    let collect;

    const filter = (interaction) => {
      return interaction.isButton() && interaction.message.id === msg.id;
    };

    const collector = msg.createMessageComponentCollector({
      filter: filter,
      time: 60000,
    });

    collector.on("collect", async (x) => {
      if (x.user.id != interaction.member.id)
        return x.reply({
          content: `**${emoji.Errado} | Você não executou o comando para poder usar os botões.**`,
          ephemeral: true,
        });

      collect = x;

      switch (x.customId) {
        case "yes": {
          interaction.followUp(`**${emoji.Certo} | Casamento cancelado com sucesso.**`);

          await User.findOneAndUpdate(
            { idU: interaction.member.id },
            {
              $set: {
                "marry.user": "null",
                "marry.has": false,
                "marry.time": 0,
              },
            }
          );
          await User.findOneAndUpdate(
            { idU: interaction.member.id },
          );
          await User.findOneAndUpdate(
            { idU: doc.marry.user },
            {
              $set: {
                "marry.user": "null",
                "marry.has": false,
                "marry.time": 0,
              },
            }
          );

          msg.delete();
          break;
        }

        case "no": {
          msg.delete();

          return interaction.followUp(`**${emoji.Certo} | ${interaction.user} mudou de ideia e manteve o casamento.**!`);
        }
      }
    });

    collector.on("end", (x) => {
      if (collect) return;
    });
  },
};
