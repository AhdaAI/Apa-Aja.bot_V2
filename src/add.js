const { SlashCommandBuilder, EmbedBuilder, SelectMenuBuilder, PermissionsBitField, CommandInteraction } = require('discord.js')
const model = require('../db')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('[ADMIN] Adding role to database')
        .addRoleOption(option => option
            .setName('role')
            .setDescription('The role to add')
            .setRequired(true)
        )
        .addStringOption(
            option => option.setName('description')
                .setDescription('default: [+] Text & Voice Channel')
                .setRequired(false)
        )
        ,

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        if(!await interaction.memberPermissions.has('Administrator')) {
            console.log(`${interaction.user.username} tried to use add`)
            await interaction.reply({
                content: `> Only admin can use this command`,
                ephemeral: true
            })

            return
        }

        const server_id = await interaction.guild.id
        const data = await interaction.options.data
        const role = data[0].role
        let desc = '[+] Text & Voice Channel'
        if(data[1]) {
            desc = data[1].value
        }

        let server = await model.findOne({server: server_id}).exec()
        if(!server) {
            const new_server = {
                server: server_id,
                roles: [{
                    name: role.name,
                    description: desc,
                    id: role.id
                }]
            }
            new model(new_server).save()
        } else {
            let check = server.roles.filter(role_db => role_db.name != role.name)
            check.push({
                name: role.name,
                description: desc,
                id: role.id
            })
            await server.updateOne({roles: check}).exec()
        }

        await interaction.reply({
            content: `NOTICE: Updated for ${await interaction.guild.name}`,
            ephemeral: true
        })
    }
}