const client = require("../../index");
const Guild = require('../../Schemas/Guild')
const User = require('../../Schemas/User')
const emoji = require('../../Utils/emojis');
const {
  MessageButton,
  MessageActionRow,
  MessageEmbed,
} = require("discord.js");
const GetMention = (id) => new RegExp(`^<@!?${id}>( |)$`);

client.on("messageCreate", async (message) => {

  if (message.author.bot) return;
  if (!message.guild) return;

  const row = new MessageActionRow();

  const button1 = new MessageButton()
    .setLabel(`Convite`)
    .setStyle("LINK")
    .setURL(
      "https://github.com/Onlyzito/Dory"
    );

  const button2 = new MessageButton()
    .setLabel("Suporte")
    .setStyle("LINK")
    .setURL("https://github.com/Onlyzito/Dory");

  const button3 = new MessageButton()
    .setLabel("Source")
    .setStyle("LINK")
    .setURL("https://github.com/Onlyzito/Dory");

  row.addComponents([button1, button2, button3]);

  const prefixzin = new MessageEmbed()
    .setColor(process.env.COLOR)
    .setDescription(`**Olá ${message.author}, vejo que está meio perdido(a)! Basta usar \`/help\` para ver meus comandos.**`);

  if (message.content.match(GetMention(client.user.id))) {
    message.reply({ embeds: [prefixzin], components: [row] });
  }


  try {
    const server = await Guild.findOne({
      idS: message.guild.id,
    });
    let user = await User.findOne({
      idU: message.author.id,
    });

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
    let xpGiveVip = user.vip.hasVip ? xpGive + Math.floor(Math.random() * 5) : xpGive;

    await User.findOneAndUpdate(
      { idU: message.author.id },
      {
        $set: {
          "Exp.xp": xp + xpGiveVip,
          "Exp.user": message.author.tag,
        },
      }
    );

    if (xp >= nextLevel) {
      await User.findOneAndUpdate(
        { idU: message.author.id },
        { $set: { "Exp.xp": 0, "Exp.level": level + 1 } }
      );

      if (!server.setrank.status) {
        return;
      } else {
        let channel = message.guild.channels.cache.get(server.setrank.channel);
        channel.send({ content: `**${emoji.LvL} | Parabéns ${message.author}!! Você acaba de subir para o nível __${level + 1}__!**` });
      }
    }

  } catch (err) {
    if (err) console.error(err);
  }

});
