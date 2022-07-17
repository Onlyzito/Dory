const client = require("../../index");
const Guild = require('../../Schemas/Guild')
const dayjs = require('dayjs');
const { MessageEmbed } = require("discord.js");

client.on("guildMemberAdd", async (member) => {
    try {
        let guild = member.guild;

        const server = await Guild.findOne({
            idS: guild.id,
        });

        if (server.antifake.status) {
            const timeAccount = dayjs(new Date()).diff(
                member.user.createdAt,
                "days"
            );

            const minimumDays = server.antifake.days;

            if (timeAccount < minimumDays) {

                const antiFuki = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle(`AntiFake System`)
                    .setDescription(`**Você precisa ter uma conta criada há pelo menos __${minimumDays} dias__ para entrar nesse servidor.**`)
                    .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
                    .setFooter({ text: `${guild.name}` })
                    .setTimestamp()

                await member.send({ embeds: [antiFuki] })

                await member.kick(`AntiFake System.`).catch(() => { });
            }
        }
    } catch (err) {
        if (err) console.log(err);
    }


});
