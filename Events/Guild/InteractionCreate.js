const client = require("../../index");

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    const command = client.SlashCommands.get(interaction.commandName);

    if (!interaction.guild) return;

    if (!command)
      return (
        interaction.reply({
          content:
            "Perdão, ocorreu um erro inesperado! Tente novamente mais tarde.",
          ephemeral: true,
        }) && client.SlashCommands.delete(interaction.commandName)
      );

    if (!interaction.member.permissions.has(command.userPermissions || []))
      return interaction.reply({
        content: `Você precisa da permissão \`${command.userPermissions || []
          }\` para usar esse comando!`,
        ephemeral: true,
      });

    if (command.maintenance) {
      if (!process.env.OWNER.includes(interaction.user.id)) {
        return interaction.reply({
          content: `Esse comando está em manutenção no momento! Tente novamente mais tarde.`,
        });
      }
    }

    if (!interaction.guild.me.permissions.has(command.botPermissions || []))
      return interaction.reply({
        content: `Eu preciso da permissão \`${cmd.botPermissions || []
          }\` para executar esse comando!`,
        ephemeral: true,
      });

    if (command.ownerOnly) {
      if (!process.env.OWNER.includes(interaction.user.id)) {
        return;
      }
    }

    command.run(client, interaction);
  }

  if (interaction.isContextMenu()) {
    const command = client.SlashCommands.get(interaction.commandName);
    if (command) command.run(client, interaction);
  }

});
