const { MessageEmbed } = require("discord.js")
const ms = require("ms")


module.exports = {
    name: "timeout",
    description: '[🛡️] Coloque um usuário de castigo.',
    options: [{
        name: 'usuario',
        description: 'Selecione/insira o ID do usuário que deseja colocar de castigo.',
        type: 'USER',
        required: true
    },
    {
        name: 'tempo',
        description: 'Informe o tempo em milisegundos',
        type: 'STRING',
        required: true
    },
    {
        name: 'motivo',
        description: 'Informe o motivo do castigo.',
        type: 'STRING',
        required: true

    }

    ],

    run: async (client, interaction, args) => {

        const user = interaction.options.getUser('usuario')
        const time = interaction.options.getString('tempo')
        const reason = interaction.options.getString('motivo') || 'Não informado.'
        const member = interaction.guild.members.cache.get(user.id)
        const timer = ms(time)

        if (interaction.user.id === user.id)
            return interaction.reply({ content: '**Você não pode castigar a si mesmo!**', ephemeral: true })

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ content: '**O cargo do usuário é mais alto que o seu! Portanto, você não consegue castigar ele.**', ephemeral: true })

        if (interaction.guild.me.roles.highest.position <= member.roles.highest.position)
            return interaction.reply({ content: '**O cargo do usuário é mais alto que o meu! Portanto, não consigo castigar ele.**', ephemeral: true })

        if (timer < 10000 || timer > 2419200000) return interaction.reply({ content: `**Esse tempo excede/ou é menor que o limite de castigo! O tempo vai de 10 segundos até 28 dias.\nExemplo: /timeout @Dory 1m teste\nEsse 1m refere-se a 1 minuto, ou seja, s(segundos) m(minutos) d(dias).**`, ephemeral: true })

        const castigado = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setAuthor({ name: `${interaction.guild.name} - Castigo`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .addFields(
                { name: `🔨 Autor`, value: `${interaction.user} \`(${interaction.user.id})\``, inline: false },
                { name: `👤 Usuário Castigado`, value: `${user} \`(${user.id})\``, inline: false },
                { name: `⏳ Tempo`, value: `**${time}**`, inline: false },
                { name: `📃 Motivo`, value: `**${reason}**`, inline: false },

            )
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setTimestamp()

        const castigo = new MessageEmbed()
            .setColor(process.env.COLOR)
            .addFields(
                { name: `🛡 Você foi castigado no servidor`, value: `**${interaction.guild.name}**`, inline: false },
                { name: `👤 Autor`, value: `${interaction.user.tag} \`(${interaction.user.id})\``, inline: false },
                { name: `⏳ Tempo`, value: `**${time}**`, inline: false },
                { name: `📃 Motivo`, value: `**${reason}**`, inline: false },

            )
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
            .setTimestamp()

        await user.send({ embeds: [castigo] })

        member.timeout(timer, reason)
            .then(() => interaction.reply({ embeds: [castigado] }))
            .catch(() => interaction.reply({ content: '**Erro ao castigar o usuário!**', ephemeral: true }))


    }
}
