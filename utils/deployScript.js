const { REST, Routes } = require('discord.js')
const { env } = require('process')
const { command, event } = require('./commandImport')
require('dotenv').config()

const { ClientID, GuildID, TOKEN } = env

const rest = new REST({ version: '10' }).setToken(TOKEN)

var start = async (client) => {
  const { localCommand, globalCommand } = command

  console.log(`Refreshing ${localCommand.length} local application (/) commands.`)
  const localData = await rest.put(
    Routes.applicationGuildCommands(ClientID, GuildID),
    { body: localCommand }
  )

  console.log(`Refreshing ${globalCommand.length} global application (/) commands.`)
  const globalData = await rest.put(
    Routes.applicationCommands(ClientID),
    { body: globalCommand }
  )

  console.log('Event creation.')
  for (const eve of event) {
    if (event.once) {
      client.once(eve.name, async (...args) => eve.execute(...args))
    } else {
      client.on(eve.name, async (...args) => eve.execute(...args))
    }
  }
}

module.exports = {
  start
}