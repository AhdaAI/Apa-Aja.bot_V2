const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, CommandInteraction } = require('discord.js')
const model = require('../db')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('[ADMIN] Delete one role from database')
        .addRoleOption(
            option => option.setName('role')
                .setDescription('The role to delete')
                .setRequired(true)
        )
        ,

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        if(!await interaction.memberPermissions.has('Administrator')) {
            console.log(`${interaction.user.username} tried to use delete`)
            await interaction.reply({
                content: `> Only admin can use this command`,
                ephemeral: true
            })

            return
        }

        const server =  await interaction.guild
        let server_db = await model.findOne({server: server.id}).exec()
        if(!server_db) {
            await interaction.reply({
                content: `ERROR: Could not find ${server.name} in database`,
                ephemeral: true
            })
            return
        }

        const role = await interaction.options.data[0].role
        let temp = server_db.roles.filter(name => name.name != role.name)
        await server_db.updateOne({roles: temp}).exec()

        await interaction.reply({
            content: `NOTICE: Updated database for ${server.name}`,
            ephemeral: true
        })
    }
}