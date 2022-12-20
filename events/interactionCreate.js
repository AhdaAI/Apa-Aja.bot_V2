const { Interaction, codeBlock } = require('discord.js')
const data = require('../utils/channel.json')
const client = require('../index')

module.exports = {
  name: 'interactionCreate',
  once: false,

  /**
   * @param {Interaction} interact
   */
  async execute (interact) {
    if(interact.isChatInputCommand()) {
      const command = client.commands.get(interact.commandName)

      // Handling unknown interactions
      if(!command) {
        return await interact.reply({
          ephemeral: true,
          content: codeBlock('Error: Command not found!')
        })
      }

      // Handling Known interaction
      try {
        await command.execute(interact)
      } catch(e) {
        await interact.reply({
          content:'Error: Command failed to interact',
          ephemeral: true
        })
        const log = await interact.guild.channels.fetch(data.logs)
        await log.send({
          content: codeBlock(`Code: ${e.code}\nMessage: ${e.message}\nStatus: ${e.status}`)
        })
      }
    }
  }
}