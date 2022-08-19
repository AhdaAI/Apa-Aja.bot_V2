const { SlashCommandBuilder, EmbedBuilder, CommandInteraction } = require('discord.js')
const model = require('../db')
const builder = require('../utils/builder')
const { users, channel } = require('../utils/conf.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panel')
        .setDescription('Show panel for information and role management')
        ,

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const server = await interaction.guild
        const fancy = new EmbedBuilder()
            .setTitle(server.name)
            .setURL('https://bit.ly/IqT6zt')
            .setThumbnail(server.iconURL())
            .setDescription(`The server for everything...`)
            .setFooter({
                text: '!!! CHECK BOT ONLINE STATUS !!!'
            })

        await interaction.guild.channels.cache
        //add more field here
        let field = []
        field.push({
            name: '__*Commands*__',
            value: `
                > *FreadBoat* = ;;
                > *Chip Bot* = !
                > *Melijn* = -
            `,
            inline: false
        })
        field.push({
            name: '__*Information*__',
            value: `
                >>> Role: ${await interaction.guild.channels.fetch(channel.role)}
                Member count: ${await interaction.guild.memberCount}
            `,
            inline: true
        })
        field.push({
            name: `__*Credits*__`,
            value: `
                >>> Server owner: ${await interaction.guild.fetchOwner()}
                Bot Profile picture: ${await interaction.guild.members.fetch(users.credits)}
            `,
            inline: true
        })

        fancy.addFields(field) //adding field to embeds

        let option = []
        const server_db = await model.findOne({server: server.id}).exec()
        if(!server_db) {
            return await interaction.reply({
                embeds: [fancy]
            })
        } else {
            server_db.roles.forEach(r => option.push({label: r.name, description: r.description, value: r.id}))
        }

        const select_menu = new builder('panel').dropDown('Select a role', option)

        // const row = new ActionRowBuilder()
        //     .addComponents(
        //         new SelectMenuBuilder()
        //             .setCustomId('panel')
        //             .setPlaceholder('')
        //     )

        await interaction.reply({
            embeds: [fancy],
            components: [select_menu]
        })
    }
}