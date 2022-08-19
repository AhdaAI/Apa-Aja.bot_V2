const { SlashCommandBuilder, EmbedBuilder, CommandInteraction, ButtonStyle } = require('discord.js')
const model = require('../db')
const builder = require('../utils/builder')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Add or remove role')
    ,

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const server = await interaction.guild
        const user = await interaction.user
        const fancy = new EmbedBuilder()
            .setTitle('__ROLE CHANGE__')
            .setDescription('Some role might add new text channel or new voice channel')
            .setThumbnail(user.avatarURL())
        
        let option = []
        const server_db =  await model.findOne({server: server.id}).exec()
        if(!server_db) {
            return await interaction.reply({
                content: 'An error has occurred, please contact admin',
                ephemeral: true
            })
        } else {
            server_db.roles.forEach(role => option.push({label: role.name, description: role.description, value: role.id}))
        }
        const select_menu = new builder('role').dropDown('Select a role', option)

        await interaction.reply({
            embeds: [fancy],
            components: [select_menu],
            ephemeral: true
        })
    }
}