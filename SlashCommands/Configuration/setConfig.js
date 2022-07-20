const { MessageEmbed } = require("discord.js");
const Guild = require("../../Schemas/Guild");
const emoji = require('../../Utils/emojis');

module.exports = {
    name: "setconfig",
    description: "[🔨] Configure os sistemas.",
    userPermissions: ["MANAGE_MESSAGES"],
    botPermissions: ["MANAGE_MESSAGES"],
    options: [
        {
            name: "painel",
            description: "[🔨] Exibe o painel.",
            type: "SUB_COMMAND",
        },
        {
            name: "antifake",
            description: "[🔨] Configure o AntiFake.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "dias",
                    description: "Informe a quantia de dias.",
                    type: "NUMBER",
                    required: false,
                },
                {
                    name: "ligar",
                    description: "Deseja ligar ou desligar?",
                    type: "BOOLEAN",
                    required: false,
                },
            ],
        }, {
            name: "logs",
            description: "[🔨] Configure o Logs.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "canal",
                    description: "Selecione o canal de logs.",
                    type: "CHANNEL",
                    channelTypes: ['GUILD_TEXT'],
                    required: false,
                },
                {
                    name: "ligar",
                    description: "Deseja ligar ou desligar?",
                    type: "BOOLEAN",
                    required: false,
                }
            ],
        }, {
            name: "logspunição",
            description: "[🔨] Configure o Logs de Punições.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "canal",
                    description: "Selecione o canal de Logs Punição.",
                    type: "CHANNEL",
                    channelTypes: ['GUILD_TEXT'],
                    required: false,
                },
                {
                    name: "ligar",
                    description: "Deseja ligar ou desligar?",
                    type: "BOOLEAN",
                    required: false,
                },
            ],
        }, {
            name: "rankup",
            description: "[🔨] Configure o canal de RankUp.",
            type: "SUB_COMMAND",
            options: [

                {
                    name: "canal",
                    description: "Selecione o canal.",
                    type: "CHANNEL",
                    channelTypes: ['GUILD_TEXT'],
                    required: false,
                },
                {
                    name: "ligar",
                    description: "Deseja ligar ou desligar?",
                    type: "BOOLEAN",
                    required: false,
                },
            ],
        }
    ],

    run: async (client, interaction) => {

        switch (interaction.options.getSubcommand()) {
            case "painel": {

                const dobi = await Guild.findOne({
                    idS: interaction.guild.id,
                });

                const painel = new MessageEmbed()
                    .setAuthor({ name: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setColor(process.env.COLOR)
                    .addFields(
                        { name: `📮 | Logs`, value: `\`${dobi.logs.status ? "Ativo" : "Desativado"}\``, inline: true },
                        { name: `✨ | Canal`, value: `${dobi.logs.channel == "null" ? "Nenhum" : `<#${dobi.logs.channel}>`}`, inline: true },
                        { name: '\u200B', value: '\u200B', inline: true },
                        { name: `🛠 | Logs Punição`, value: `\`${dobi.logspuni.status ? "Ativo" : "Desativado"}\``, inline: true },
                        { name: `✨ | Canal`, value: `${dobi.logspuni.channel == "null" ? "Nenhum" : `<#${dobi.logspuni.channel}>`}`, inline: true },
                        { name: '\u200B', value: '\u200B', inline: true },
                        { name: `${emoji.LvL} | RankUp`, value: `\`${dobi.setrank.status ? "Ativo" : "Desativado"}\``, inline: true },
                        { name: `✨ | Canal`, value: `${dobi.setrank.channel == "null" ? "Nenhum" : `<#${dobi.setrank.channel}>`}`, inline: true },
                        { name: '\u200B', value: '\u200B', inline: true },
                        { name: `👥 | AntiFake`, value: `\`${dobi.antifake.status ? "Ativo" : "Desativado"}\``, inline: true },
                        { name: `📆 | Dias`, value: `${dobi.antifake.days <= 0 ? "0" : `${dobi.antifake.days}`}`, inline: true },
                        { name: '\u200B', value: '\u200B', inline: true },
                    )

                interaction.reply({ embeds: [painel] })

            } break;

            case "antifake": {
                let days = interaction.options.getNumber("dias")
                let escolha = interaction.options.getBoolean("ligar")

                const server = await Guild.findOne({
                    idS: interaction.guild.id,
                });

                const anti = server.antifake;

                if (days) {
                    if (days < 1 || days > 30) {
                        return interaction.reply({ content: `${emoji.Errado} **|** **Você precisa informar uma quantia entre 1 e 30 dias!**`, ephemeral: true });
                    }

                    if (anti.days === days) {
                        return interaction.reply({ content: `${emoji.Errado} **|** **A quantia informada é a mesma setada atualmente!**`, ephemeral: true });
                    }

                    interaction.reply(`${emoji.Certo} **|** Dias alterado com sucesso.`);

                    await Guild.findOneAndUpdate(
                        { idS: interaction.guild.id },
                        { $set: { "antifake.days": days } }
                    );

                    return;
                }



                if (escolha == true) {
                    if (anti.days <= 1)
                        return interaction.reply({ content: `${emoji.Errado} **| Para ativar o sistema de AntiFake você precisa setar os dias antes!**`, ephemeral: true });

                    if (anti.status)
                        return interaction.reply({ content: `${emoji.Errado} **|** **O sistema já se encontra ativo!**`, ephemeral: true });

                    interaction.reply(`${emoji.Certo} **|** Sistema de **AntiFake** ativado com sucesso.`);
                    await Guild.findOneAndUpdate(
                        { idS: interaction.guild.id },
                        { $set: { "antifake.status": true } }
                    );

                }

                if (escolha == false) {
                    if (!anti.status)
                        return interaction.reply({ content: `${emoji.Errado} **|** **O sistema já se encontra desativado!**`, ephemeral: true });

                    interaction.reply(`${emoji.Certo} **|** Sistema de **AntiFake** desativado com sucesso.`);
                    await Guild.findOneAndUpdate(
                        { idS: interaction.guild.id },
                        { $set: { "antifake.status": false } }
                    );
                }
            } break;

            case "logs": {
                let logs = interaction.options.getChannel("canal");
                let escolha = interaction.options.getBoolean("ligar");

                const server = await Guild.findOne({
                    idS: interaction.guild.id,
                });

                if (logs) {
                    if (!logs.isText() || logs.isVoice()) {
                        return interaction.reply({ content: `${emoji.Errado} **|** **O canal deve ser um canal de texto!**`, ephemeral: true })
                    }

                    if (logs.id == server.logs.channel) {
                        return interaction.reply({ content: `${emoji.Errado} **|** **Esse canal é o mesmo setado atualmente!**`, ephemeral: true })
                    } else {
                        interaction.reply(`${emoji.Certo} **|** O canal **<#${logs.id}>**, foi setado como canal de **logs** com sucesso!`);
                        await Guild.findOneAndUpdate(
                            { idS: interaction.guild.id },
                            { $set: { "logs.channel": logs.id } }
                        );
                    }

                    return;
                }

                if (escolha == true) {
                    if (server.logs.channel == "null") {
                        return interaction.reply({ content: `${emoji.Errado} **| Para ativar o sistema de logs você precisa setar um canal antes!**`, ephemeral: true });
                    } else if (server.logs.status) {
                        return interaction.reply({ content: `${emoji.Errado} **|** **O sistema já se encontra ativo!**`, ephemeral: true });
                    } else {
                        interaction.reply(`${emoji.Certo} **|** Sistema de **logs** ativado com sucesso.`);
                        await Guild.findOneAndUpdate(
                            { idS: interaction.guild.id },
                            { $set: { "logs.status": true } }
                        );
                    }
                };

                if (escolha == false) {
                    if (!server.logs.status) {
                        return interaction.reply({ content: `${emoji.Errado} **|** **O sistema já se encontra desativado!**`, ephemeral: true });
                    } else {
                        interaction.reply(`${emoji.Certo} **|** Sistema de **logs** desativado com sucesso.`);
                        await Guild.findOneAndUpdate(
                            { idS: interaction.guild.id },
                            { $set: { "logs.status": false } }
                        );
                    }
                };

            } break;

            case "logspunição": {

                let logs = interaction.options.getChannel("canal");
                let escolha = interaction.options.getBoolean("ligar");

                const server = await Guild.findOne({
                    idS: interaction.guild.id,
                });

                if (logs) {
                    if (!logs.isText() || logs.isVoice()) {
                        return interaction.reply({ content: `${emoji.Errado} **|** **O canal deve ser um canal de texto!**`, ephemeral: true })
                    }

                    if (logs.id == server.logspuni.channel) {
                        return interaction.reply({ content: `${emoji.Errado} **|** **Esse canal é o mesmo setado atualmente!**`, ephemeral: true })
                    } else {
                        interaction.reply(`${emoji.Certo} **|** O canal **<#${logs.id}>**, foi setado como canal de **logs punição** com sucesso!`);
                        await Guild.findOneAndUpdate(
                            { idS: interaction.guild.id },
                            { $set: { "logspuni.channel": logs.id } }
                        );
                    }

                    return;
                }

                if (escolha == true) {
                    if (server.logspuni.channel == "null") {
                        return interaction.reply({ content: `${emoji.Errado} **| Para ativar o sistema __logs de punição__, você precisa setar um canal antes!**`, ephemeral: true });
                    } else if (server.logspuni.status) {
                        return interaction.reply({ content: `${emoji.Errado} **|** **O sistema já se encontra ativo!**`, ephemeral: true });
                    } else {
                        interaction.reply(`${emoji.Certo} **|** Sistema **logs punição** ativado com sucesso.`);
                        await Guild.findOneAndUpdate(
                            { idS: interaction.guild.id },
                            { $set: { "logspuni.status": true } }
                        );
                    }
                };

                if (escolha == false) {
                    if (!server.logspuni.status) {
                        return interaction.reply({ content: `${emoji.Errado}| **O sistema já se encontra desativado!**`, ephemeral: true });
                    } else {
                        interaction.reply(`${emoji.Certo} **|** Sistema **logs punição** desativado com sucesso.`);
                        await Guild.findOneAndUpdate(
                            { idS: interaction.guild.id },
                            { $set: { "logspuni.status": false } }
                        );
                    }
                };
            } break;

            case "rankup": {
                let logs = interaction.options.getChannel("canal");
                let escolha = interaction.options.getBoolean("ligar");

                const server = await Guild.findOne({
                    idS: interaction.guild.id,
                });

                if (logs) {
                    if (!logs.isText() || logs.isVoice()) {
                        return interaction.reply({ content: `${emoji.Errado} **|** **O canal deve ser um canal de texto!**`, ephemeral: true })
                    }

                    if (logs.id == server.setrank.channel) {
                        return interaction.reply({ content: `${emoji.Errado} **|** **Esse canal é o mesmo setado atualmente!**`, ephemeral: true })
                    } else {
                        interaction.reply(`${emoji.Certo} **|** O canal **<#${logs.id}>**, foi setado como canal de **Rankup** com sucesso!`);
                        await Guild.findOneAndUpdate(
                            { idS: interaction.guild.id },
                            { $set: { "setrank.channel": logs.id } }
                        );
                    }

                    return;
                }

                if (escolha == true) {
                    if (server.setrank.channel == "null") {
                        return interaction.reply({ content: `${emoji.Errado} **| Para ativar o sistema de rankup você precisa setar um canal antes!**`, ephemeral: true });
                    } else if (server.setrank.status) {
                        return interaction.reply({ content: `${emoji.Errado} **|** **O sistema já se encontra ativo!**`, ephemeral: true });
                    } else {
                        interaction.reply(`${emoji.Certo} **|** Sistema de **rankup** ativado com sucesso.`);
                        await Guild.findOneAndUpdate(
                            { idS: interaction.guild.id },
                            { $set: { "setrank.status": true } }
                        );
                    }
                };

                if (escolha == false) {
                    if (!server.setrank.status) {
                        return interaction.reply({ content: `${emoji.Errado} **|** **O sistema já se encontra desativado!**`, ephemeral: true });
                    } else {
                        interaction.reply(`${emoji.Certo} **|** Sistema de **rankup** desativado com sucesso.`);
                        await Guild.findOneAndUpdate(
                            { idS: interaction.guild.id },
                            { $set: { "setrank.status": false } }
                        );
                    }
                };

            } break;
        }
    }
};