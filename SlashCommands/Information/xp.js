const { MessageEmbed } = require("discord.js");
const User = require("../../Schemas/User");
const emoji = require('../../Utils/emojis');

module.exports = {
  name: "xp",
  description: "[💼] Exibe o extrato bancário do usuário.",
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

    User.findOne({ idU: USER.id }, async (err, user) => {
      await require("mongoose")
        .connection.collection("users")
        .find({ "Exp.xp": { $gt: 5 } })
        .toArray((err, res) => {
          if (err) throw err;
          let Exp = res.map((x) => x.Exp).sort((x, f) => f.level - x.level);

          let ranking =
            [...Exp.values()].findIndex((x) => x.id === interaction.member.id) + 1;

          let xp = user.Exp.xp;
          let level = user.Exp.level;
          let nextLevel = user.Exp.nextLevel * level;

          const aincalica = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setTitle(`${USER.username} - XP`)
            .addFields(
              { name: `🌐 | Nível`, value: `${level}`, inline: false },
              { name: `💠 | XP`, value: `\`[${xp}|${nextLevel}]\``, inline: false },
            )
            .setThumbnail(USER.displayAvatarURL({ dynamic: true, size: 1024, format: "png" }))

          interaction.reply({ embeds: [aincalica] })

        });
    });
  },
};
