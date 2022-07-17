const Guild = require("../../Schemas/Guild");
const emoji = require('../../Utils/emojis');

module.exports = {
    name: "logs",
    description: "[⚙] Ativa ou desativa o logs.",
    userPermissions: ["MANAGE_MESSAGES"],
    botPermissions: ["MANAGE_MESSAGES"],
    options: [
        {
            name: "escolher",
            type: "BOOLEAN",
            description: "Escolha se deseja ligar ou desligar.",
            required: true,
        },
    ],

    run: async (client, interaction) => {
        let escolha = interaction.options.getBoolean("escolher");

        const server = await Guild.findOne({
            idS: interaction.guild.id,
        });

        if (escolha == true) {
            if (server.logs.channel == "null") {
                return interaction.reply({ content: `${emoji.Errado}| Para ativar o sistema de logs você precisa setar um canal antes! **Use \`/setlogs\`**`, ephemeral: true });
            } else if (server.logs.status) {
                return interaction.reply({ content: `${emoji.Errado}| **O sistema já se encontra ativo!**`, ephemeral: true });
            } else {
                interaction.reply(`${emoji.Certo}| Sistema de **logs** ativo com sucesso.`);
                await Guild.findOneAndUpdate(
                    { idS: interaction.guild.id },
                    { $set: { "logs.status": true } }
                );
            }
        };

        if (escolha == false) {
            if (!server.logs.status) {
                return interaction.reply({ content: `${emoji.Errado}| **O sistema já se encontra desativado!**`, ephemeral: true });
            } else {
                interaction.reply(`${emoji.Certo}| Sistema de **logs** desativado com sucesso.`);
                await Guild.findOneAndUpdate(
                    { idS: interaction.guild.id },
                    { $set: { "logs.status": false } }
                );
            }
        };
    },
};
