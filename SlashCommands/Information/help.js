const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  description: "[🔍] Exibe meu painel de ajuda.",

  run: async (client, interaction) => {

    const help = new MessageEmbed()
      .setColor(process.env.COLOR)
      .setTitle(`${client.user.username} - Central de Ajuda.`)
      .setDescription(`**Olá ${interaction.user.username}, abaixo você verá todos os meus comandos disponíveis!**`)

    const commands = client.SlashCommands.map((x) => x.dir).filter((x, f, y) => y.indexOf(x) === f);

    commands.forEach(async (dir) => {

      const comandos = client.SlashCommands
        .filter((x) => x.dir === dir)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((f) => `\`${f.name}\``)
        .join("** | **");

      help.addField(dir, comandos || `Nenhum Comando`, false)
    })

    interaction.reply({ embeds: [help] })
  },
};