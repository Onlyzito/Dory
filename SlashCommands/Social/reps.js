const User = require("../../Schemas/User");
const emoji = require('../../Utils/emojis');
const Day = require('dayjs')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "reps",
    description: "[🔮] Exibe informações sobre a reputação.",
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

        const doc = await User.findOne({ idU: USER.id });

        if (!doc) {
            return interaction.reply({ content: `**${emoji.Errado} | Esse usuário não está cadastrado em meu banco de dados! Basta enviar uma mensagem em qualquer canal para registrar.**`, ephemeral: true })
        }

        const rep = doc.reps;

        const lastReceived =
            rep.lastRep == "null" ? "" : await client.users.fetch(rep.lastRep);
        const lastSend =
            rep.lastSend == "null" ? "" : await client.users.fetch(rep.lastSend);

        const EMBED = new MessageEmbed()

            .setColor(process.env.COLOR)
            .setTitle(`Reputação de ${USER.username}`)
            .addFields(
                {
                    name: `Reputações Recebidas`,
                    value: `${rep.size == 0 ? "Nenhuma" : rep.size}`,
                },
                {
                    name: `Reputações Enviadas`,
                    value: `${rep.size2 == 0 ? "Nenhuma" : rep.size2}`,
                },
                {
                    name: `Última reputação recebida`,
                    value: `\`${rep.lastRep == "null" ? "Ninguém" : lastReceived.tag}\``,
                },
                {
                    name: `Última reputação enviada`,
                    value: `\`${rep.lastRep == "null" ? "Ninguém" : lastSend.tag}\``,
                },
            )
            .setThumbnail(USER.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setTimestamp();

        interaction.reply({ embeds: [EMBED] });

    },
};
