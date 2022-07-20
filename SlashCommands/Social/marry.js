const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const User = require('../../Schemas/User')
const emoji = require('../../Utils/emojis');

module.exports = {
  name: "marry",
  description: "[🔮] Case com sua alma gêmea.",
  options: [
    {
      name: "usuario",
      type: "USER",
      description: "Selecione o usuário que deseja se casar.",
      required: true,
    },
    {
      name: "mensagem",
      type: "STRING",
      description: "Escreva sua mensagem de pedido.",
      required: true,
    },
  ],

  run: async (client, interaction) => {
    let user = interaction.options.getUser("usuario");
    let message = interaction.options.getString("mensagem")

    const doc = await User.findOne({ idU: interaction.member.id })

    if (user.bot)
      return interaction.reply({ content: `**${emoji.Errado} | Não é possível casar-se com BOT!**`, ephemeral: true });

    if (user.id === interaction.member.id)
      return interaction.reply({ content: `**${emoji.Errado} | Você não pode casar com si mesmo!**`, ephemeral: true });

    if (doc.marry.has) return interaction.reply({ content: `**${emoji.Errado} | Você já é casado!**`, ephemeral: true });

    const target = await User.findOne({ idU: user.id });

    if (!target) {
      return interaction.reply({ content: `**${emoji.Errado} | Esse usuário não está cadastrado em meu banco de dados! Basta enviar uma mensagem em qualquer canal para registrar.**`, ephemeral: true })
    }

    if (target.marry.has)
      return interaction.reply({
        content:
          `**${emoji.Errado} | Esse usuário já está casado(a) com \`${await client.users
            .fetch(target.marry.user)
            .then((x) => x.tag)}\`**.`, ephemeral: true
      });

    const row = new MessageActionRow();

    const yesButton = new MessageButton()
      .setCustomId("yes")
      .setLabel("Aceitar")
      .setStyle("SUCCESS")
      .setDisabled(false);

    const noButton = new MessageButton()
      .setCustomId("no")
      .setLabel("Recusar")
      .setStyle("DANGER")
      .setDisabled(false);

    row.addComponents([yesButton, noButton]);


    const casamentinho = new MessageEmbed()
      .setColor(process.env.COLOR)
      .setTitle(`💖 proposta de casamento 💖`)
      .setDescription(`**${interaction.user}: ${message}**\n\n **${user} deseja aceitar?**`);

    const msg = await interaction.reply({ content: `${user}`, embeds: [casamentinho], components: [row], fetchReply: true });

    let collect;

    const filter = (interaction) => {
      return interaction.isButton() && interaction.message.id === msg.id;
    };

    const collector = msg.createMessageComponentCollector({
      filter: filter,
      time: 60000,
    });

    collector.on("collect", async (x) => {
      if (x.user.id != user.id)
        return x.reply({
          content: `**Não se meta no pedido dos outros! Que coisa feia... 😑**`,
          ephemeral: true,
        });

      collect = x;

      switch (x.customId) {
        case "yes": {
          interaction.followUp(`**${user} aceitou seu pedido de casamento! Felicidades 💖**`);

          await User.findOneAndUpdate(
            { idU: interaction.member.id },
            {
              $set: {
                "marry.user": user.id,
                "marry.has": true,
                "marry.time": Date.now(),
              },
            }
          )
          /*await User.findOneAndUpdate(
            { idU: interaction.member.id },
          );*/
          await User.findOneAndUpdate(
            { idU: user.id },
            {
              $set: {
                "marry.user": interaction.member.id,
                "marry.has": true,
                "marry.time": Date.now(),
              },
            }
          );

          msg.delete();
          break;
        }

        case "no": {
          msg.delete();

          return interaction.followUp(`**${user} recusou seu pedido de casamento. 🥶**`);
        }
      }
    });

    collector.on("end", (x) => {
      if (collect) return;
      interaction.followUp({ content: `**${emoji.Errado} | Tempo esgotado! O usuário não respondeu.**`, ephemeral: true })
      msg.delete()
    });
  },
};
