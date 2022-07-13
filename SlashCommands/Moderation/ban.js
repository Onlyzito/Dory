const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'ban',
    description: '[🛡️] Bane um usuário do servidor.',
    options: [{
        name: 'usuario',
        type: 'USER',
        description: 'Selecione o usuário que deseja banir.',
        required: true,
    },
    {
        name: 'motivo',
        description: 'Informe o motivo do banimento.',
        type: 'STRING',
        required: false
    }
    ],
    run: async (client, interaction) => {
        const user = interaction.options.getUser('usuario')
        const reason = interaction.options.getString('motivo') || 'Não informado.'
        const member = interaction.guild.members.cache.get(user.id)

        if (interaction.user.id === user.id)
            return interaction.reply({ content: '**Você não pode banir a si mesmo!**', ephemeral: true })

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ content: '**O cargo do usuário é mais alto que o seu! Portanto, você não consegue banir ele.**', ephemeral: true })

        if (interaction.guild.me.roles.highest.position <= member.roles.highest.position)
            return interaction.reply({ content: '**O cargo do usuário é mais alto que o meu! Portanto, não consigo banir ele.**', ephemeral: true })

        const banimento = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setAuthor({ name: `${interaction.guild.name} - Banimento`, iconURL: interaction.guild.iconURL({ dybanic: true }) })
            .addFields(
                { name: `🔨 Autor do Banimento`, value: `${interaction.user} \`(${interaction.user.id})\``, inline: false },
                { name: `👤 Usuário Banido`, value: `${user} \`(${user.id})\``, inline: false },
                { name: `📃 Motivo`, value: `**${reason}**`, inline: false },

            )
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setTimestamp()

        const banido = new MessageEmbed()
            .setColor(process.env.COLOR)
            .addFields(
                { name: `🛡 Você foi banido do servidor`, value: `**${interaction.guild.name}**`, inline: false },
                { name: `👤 Autor do Banimento`, value: `${interaction.user.tag} \`(${interaction.user.id})\``, inline: false },
                { name: `📃 Motivo`, value: `**${reason}**`, inline: false },

            )
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
            .setTimestamp()

        await user.send({ embeds: [banido] })

        interaction.guild.members.ban(user, { reason })
            .then(() => interaction.reply({ embeds: [banimento] }))
            .catch(() => interaction.reply({ content: '**Erro ao banir o usuário!**', ephemeral: true }))

    }
}