const User = require("../../Schemas/User");
const emoji = require('../../Utils/emojis');
const { extend } = require('dayjs');
const duration = require('dayjs/plugin/duration');
extend(duration);
const Day = require('dayjs')

module.exports = {
  name: "daily",
  description: "[💸] Resgata um bônus díario.",

  run: async (client, interaction) => {
    const user = await User.findOne({
      idU: interaction.member.id,
    });

    const give = Math.floor(Math.random() * 300);
    let cooldown = 8.64e7;
    let coins = user.vip.hasVip ? give + Math.floor(Math.random() * 500) : give;
    let daily = user.daily;
    let atual = user.coins;
    let time = cooldown - (Date.now() - daily);
    let total = coins + atual;

    if (daily !== null && cooldown - (Date.now() - daily) > 0) {
      return interaction.reply({ content: `${emoji.Errado} **|** Você já resgatou seu bônus díario hoje, aguarde **${Day.duration(time).format("HH:mm:ss")}.**` });
    } else {
      interaction.reply(`${emoji.Certo} **|** Bônus resgatado com sucesso! Você adquiriu **${coins} sapphires!** Agora você possui um total de **${total.toLocaleString()} sapphires**.`);

      await User.findOneAndUpdate(
        { idU: interaction.member.id },
        { $set: { coins: coins + atual, daily: Date.now() } }
      );
    }

  },
};
