const { Interaction } = require('discord.js')
const client = require('../index')

module.exports = {
    name: 'interactionCreate',
    once: false,

    /**
     * 
     * @param { Interaction } interaction 
     */

    async execute(interaction) {
        //command respond
        if(interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName)
            if(!command) {
                await interaction.reply({
                    content: ```Error: Command not found```,
                    ephemeral: true
                })
                return
            };

            try {
                await command.execute(interaction)
            } catch(e) {
                console.error(e)
                await interaction.reply({
                    content: `
                    >>> Error Code: **${e.code}**
                    Message: **${e.message}**
                    Status: **${e.status}**`,
                    ephemeral: true
                })
            }
        }

        //select menus respond
        if(interaction.isSelectMenu()){
            const { customId, member, values } = interaction

            //individual select menu
            if(customId === 'panel') {
                const role = await interaction.guild.roles.fetch(values[0])
                const stat = await member.roles.cache.some(r => r.name === role.name)
                await interaction.update({content: ' '})

                if(!stat) {
                    await member.roles.add(role)
                    await interaction.followUp({
                        content: `Welcome to ${role.name}`,
                        ephemeral: true
                    })
                } else {
                    await member.roles.remove(role)
                    await interaction.followUp({
                        content: `Goodbye`,
                        ephemeral: true
                    })
                }
            }

            if(customId === 'role') {
                const role = await interaction.guild.roles.fetch(values[0])
                const stat = await member.roles.cache.some(r => r === role)
                await interaction.update({
                    content: ' '
                })

                if(!stat) {
                    await member.roles.add(role)
                    await interaction.followUp({
                        content: `You've entered ${role.name} domain`,
                        ephemeral: true
                    })
                } else {
                    await member.roles.remove(role)
                    await interaction.followUp({
                        content: `We will not miss you`,
                        ephemeral: true
                    })
                }
            }
        }
    }
}