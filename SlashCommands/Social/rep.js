const User = require("../../Schemas/User");
const emoji = require('../../Utils/emojis');
const { extend } = require('dayjs');
const duration = require('dayjs/plugin/duration');
extend(duration);
const Day = require('dayjs')

module.exports = {
    name: "rep",
    description: "[🔮] Envie uma reputação.",
    options: [
        {
            name: "usuario",
            type: "USER",
            description: "Selecione o usuário pelo qual deseja enviar a reputação.",
            required: true,
        },
    ],

    run: async (client, interaction) => {
        let USER = interaction.options.getUser("usuario") || interaction.user;

        const doc = await User.findOne({ idU: interaction.member.id });
        const doc1 = await User.findOne({ idU: USER.id });

        if (USER.id == interaction.member.id) {
            return interaction.reply({ content: `**${emoji.Errado} | Você não pode enviar uma reputação para si mesmo.**`, ephemeral: true });
        }

        const rep = doc.reps;
        const cooldown = 8.64e7 - (Date.now() - rep.time);

        if (cooldown > 0) {
            return interaction.reply(`${emoji.Errado} **|** Você preicsa aguardar **${Day.duration(cooldown).format("HH:mm:ss")}** para enviar outra reputação!`);
        }

        if (USER.bot) {
            return interaction.reply({ content: `**${emoji.Errado} | Não é possível enviar reputação para BOTS.**`, ephemeral: true });
        }

        if (!doc1) {
            return interaction.reply({ content: `**${emoji.Errado} | Esse usuário não está cadastrado em meu banco de dados! Basta enviar uma mensagem em qualquer canal para registrar.**`, ephemeral: true });
        }

        interaction.reply(`${emoji.Certo} **| Reputação enviada com sucesso para ${USER}**`);

        await User.findOneAndUpdate(
            { idU: interaction.member.id },
            {
                $set: {
                    "reps.lastSend": USER.id,
                    "reps.time": Date.now(),
                    "reps.size": doc.reps.size2 + 1,
                }
            }
        );
        await User.findOneAndUpdate(
            { idU: USER.id },
            {
                $set: {
                    "reps.lastRep": interaction.member.id,
                    "reps.size": doc1.reps.size + 1,
                },
            }
        );
    },
};
