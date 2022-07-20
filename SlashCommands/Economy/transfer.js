const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const User = require('../../Schemas/User')
const emoji = require('../../Utils/emojis')

module.exports = {
    name: "transfer",
    description: "[💸] Transferir sapphires para outro usuário.",
    options: [
        {
            name: "usuario",
            type: "USER",
            description: "Selecione um usuário.",
            required: true,
        },
        {
            name: "quantia",
            type: "NUMBER",
            description: "Informe a quantia que deseja transferir.",
            required: true,
        },
    ],

    run: async (client, interaction, message) => {
        let user = interaction.options.getUser("usuario") || interaction.user;
        let valor = interaction.options.getNumber("quantia");

        const userdb = await User.findOne({
            idU: interaction.member.id,
        });

        if (user.bot) {
            return interaction.reply({ content: `**${emoji.Errado} | Não é possível fazer trasferência para BOTS!**`, ephemeral: true })
        }

        if (valor <= 0)
            return interaction.reply({ content: `**${emoji.Errado} | Você não pode transferir menos de 1 Sapphire!**`, ephemeral: true });

        if (user.id === interaction.member.id)
            return interaction.reply({ content: `**${emoji.Errado} | Você não pode transferir para si mesmo.**`, ephemeral: true });

        if (valor > userdb.coins)
            return interaction.reply({ content: `**${emoji.Errado}| Você não possui essa quantia em sapphires para realizar a transferência!**`, ephemeral: true });

        const target = await User.findOne({ idU: user.id });

        if (!target) {
            return interaction.reply({ content: `**${emoji.Errado} | Esse usuário não está cadastrado em meu banco de dados! Basta enviar uma mensagem em qualquer canal para registrar.**`, ephemeral: true })
        }

        const row = new MessageActionRow();

        const yesButton = new MessageButton()
            .setCustomId("yes")
            .setLabel("Confirmar")
            .setStyle("SUCCESS")
            .setDisabled(false);

        const noButton = new MessageButton()
            .setCustomId("no")
            .setLabel("Cancelar")
            .setStyle("DANGER")
            .setDisabled(false);

        row.addComponents([yesButton, noButton]);

        const transf = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setDescription(`**${emoji.Sapphire} **|** Você confirma a transferência de __${valor.toLocaleString()} sapphires__ para ${user}?**`)

        const msg = await interaction.reply({ embeds: [transf], components: [row], fetchReply: true });

        let collect;

        const filter = (interaction) => {
            return interaction.isButton() && interaction.message.id === msg.id;
        };

        const collector = msg.createMessageComponentCollector({
            filter: filter,
            time: 60000,
        });

        collector.on("collect", async (x) => {
            if (x.user.id != interaction.member.id)
                return x.reply({
                    content: `${emoji.Errado} **|** Você não executou o comando para usar os botões.`,
                    ephemeral: true,
                });

            collect = x;

            switch (x.customId) {
                case "yes": {
                    interaction.followUp(`${emoji.Certo} **|** Transferência concluída com sucesso.`);

                    await User.findOneAndUpdate(
                        { idU: interaction.member.id },
                        {
                            $set: {
                                coins: userdb.coins - valor,
                            },
                        }
                    );
                    await User.findOneAndUpdate(
                        { idU: user.id },
                        {
                            $set: {
                                coins: target.coins + valor,
                            },
                        }
                    );

                    msg.delete();
                    break;
                }

                case "no": {
                    msg.delete();

                    return interaction.followUp(`${emoji.Errado} **|** Transferência Cancelada!`);
                }
            }
        });

        collector.on("end", (x) => {
            if (collect) return;
            msg.delete();
            interaction.channel.send(`${emoji.Errado} **|** **Tempo esgotado!**`).then(msg => {
                setTimeout(() => msg.delete(), 10000)
            })
                .catch(() => { });
        });

    },
};
