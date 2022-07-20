const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: "botinfo",
  description: "[🎀] Mostra algumas informações.",

  run: async (client, interaction) => {

    const button = new MessageButton()
      .setLabel("Convite")
      .setStyle("LINK")
      .setURL("https://github.com/Onlyzito/Dory");

    const button2 = new MessageButton()
      .setLabel("Suporte")
      .setStyle("LINK")
      .setURL("https://github.com/Onlyzito/Dory");

    const button3 = new MessageButton()
      .setLabel("Source")
      .setStyle("LINK")
      .setURL("https://github.com/Onlyzito/Dory");

    const row = new MessageActionRow().addComponents(button, button2, button3);

    const Dory = new MessageEmbed()
      .setColor(process.env.COLOR)
      .setAuthor({ name: `Olá, eu me chamo ${client.user.username}`, iconURL: client.user.displayAvatarURL() })
      .setThumbnail(client.user.displayAvatarURL({ size: 1024 }))
      .setDescription(`**Olá ${interaction.user.username}!! Eu sou a ${client.user.username}, um simples bot com o intuito de ajudar em seu servidor.\nAbaixo você verá mais informações sobre mim.**`)
      .addFields(
        { name: '🌎 | Servidores', value: `${client.guilds.cache.size}`, inline: true },
        { name: '👥 | Usuários', value: `${client.guilds.cache.map(guild => guild.memberCount).reduce((a, b) => a + b)}`, inline: true },
        { name: '⚙️ | Comandos', value: `${client.SlashCommands.size}`, inline: true },
        { name: '📡 | Ping', value: `${client.ws.ping}ms`, inline: true },
        { name: '🗂️ | Versão', value: `0.0.1`, inline: true },
        { name: '🤖 | Acordada', value: `<t:${parseInt(client.readyTimestamp / 1000)}:R>`, inline: true },
        { name: '💻 | Memória', value: `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB\`` }


      )

    interaction.reply({ embeds: [Dory], components: [row] })
  },
};
