const { MessageEmbed } = require('discord.js')
const emoji = require('../../Utils/emojis');

module.exports = {
    name: 'kick',
    description: '[🛡️] Expulsa um usuário do servidor.',
    userPermissions: ["KICK_MEMBERS"],
    botPermissions: ["KICK_MEMBERS"],
    options: [{
        name: 'usuario',
        type: 'USER',
        description: 'Selecione o usuário que deseja expulsar.',
        required: true,
    },
    {
        name: 'motivo',
        description: 'Informe o motivo.',
        type: 'STRING',
        required: false
    }
    ],
    run: async (client, interaction) => {
        const user = interaction.options.getUser('usuario')
        const reason = interaction.options.getString('motivo') || 'Não informado.'
        const member = interaction.guild.members.cache.get(user.id)

        if (interaction.user.id === user.id)
            return interaction.reply({ content: `${emoji.Errado}| **Você não pode expulsar a si mesmo!**`, ephemeral: true })

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ content: `${emoji.Errado}| **O cargo do usuário é mais alto que o seu! Portanto, você não consegue expulsar ele.**`, ephemeral: true })

        if (interaction.guild.me.roles.highest.position <= member.roles.highest.position)
            return interaction.reply({ content: `${emoji.Errado}| **O cargo do usuário é mais alto que o meu! Portanto, não consigo expulsar ele.**`, ephemeral: true })

        const expulsao = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setAuthor({ name: `${interaction.guild.name} - Expulsão`, iconURL: interaction.guild.iconURL({ dybanic: true }) })
            .addFields(
                { name: `🔨 Autor da Expulsão`, value: `${interaction.user} \`(${interaction.user.id})\``, inline: false },
                { name: `👤 Usuário Expulso`, value: `${user} \`(${user.id})\``, inline: false },
                { name: `📃 Motivo`, value: `**${reason}**`, inline: false },

            )
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setTimestamp()

        const expulso = new MessageEmbed()
            .setColor(process.env.COLOR)
            .addFields(
                { name: `🛡 Você foi expulso do servidor`, value: `**${interaction.guild.name}**`, inline: false },
                { name: `👤 Autor da Expulsão`, value: `${interaction.user.tag} \`(${interaction.user.id})\``, inline: false },
                { name: `📃 Motivo`, value: `**${reason}**`, inline: false },

            )
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
            .setTimestamp()

        await user.send({ embeds: [expulso] })

        interaction.guild.members.kick(user)
            .then(() => interaction.reply({ embeds: [expulsao] }))
            .catch(() => interaction.reply({ content: '**Erro ao expulsar o usuário!**', ephemeral: true }))

    }
}
