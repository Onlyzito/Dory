const User = require("../../Schemas/User");
const emoji = require('../../Utils/emojis');

module.exports = {
    name: "sapphires",
    description: "[💸] Exibe o saldo de Sapphires.",
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

            if (USER.bot) {
                return interaction.reply({ content: `**${emoji.Errado} | BOTS não são cadastrados em meu banco de dados!**`, ephemeral: true })
            }

            if (!user) {
                return interaction.reply({ content: `**${emoji.Errado} | Esse usuário não está cadastrado em meu banco de dados! Basta enviar uma mensagem em qualquer canal para registrar.**`, ephemeral: true })
            }

            let coins = user.coins;

            interaction.reply(`${emoji.Sapphire} **|** ${USER} possui **${coins.toLocaleString()} sapphires**.`)

        });
    },
};
