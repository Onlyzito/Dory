const client = require("../../index");
const Guild = require('../../Schemas/Guild')
const User = require('../../Schemas/User')

client.on("messageCreate", async (message) => {

  try {
    const server = await Guild.findOne({
      idS: message.guild.id,
    });
    let user = await User.findOne({
      idU: message.author.id,
    });

    if (message.author.bot == true) return;

    if (!user)
      await User.create({
        idU: message.author.id,
        idS: message.guild.id,
      });

    if (!server)
      await Guild.create({ idS: message.guild.id });

    user = await User.findOne({
      idU: message.author.id,
    });

    let xp = user.Exp.xp;
    let level = user.Exp.level;
    let nextLevel = user.Exp.nextLevel * level;

    if (user.Exp.id == "null") {
      await User.findOneAndUpdate(
        { idU: message.author.id },
        { $set: { "Exp.id": message.author.id } }
      );
    }

    let xpGive = Math.floor(Math.random() * 5) + 1;

    await User.findOneAndUpdate(
      { idU: message.author.id },
      {
        $set: {
          "Exp.xp": xp + xpGive,
          "Exp.user": message.author.tag,
        },
      }
    );

    if (xp >= nextLevel) {
      await User.findOneAndUpdate(
        { idU: message.author.id },
        { $set: { "Exp.xp": 0, "Exp.level": level + 1 } }
      );
    }

  } catch (err) {
    if (err) console.error(err);
  }

});
