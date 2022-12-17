const { SlashCommandBuilder, CommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const{ modal } = require('../utils/builder')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggestion')
        .setDescription('Input your suggestion')
    ,

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const obj = [
            {
                id: 'idea',
                label: 'Idea',
                style: TextInputStyle.Short
            },
            {
                id: 'detail',
                label: 'Detail',
                style: TextInputStyle.Paragraph
            }
        ]

        const mod = new modal('suggest').build('Suggestion', obj)
        await interaction.showModal(mod)
    }
}