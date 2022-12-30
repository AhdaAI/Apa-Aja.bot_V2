const { readdirSync } = require('fs')
const { join } = require('path')

const events = []
const commands = {
  globalCommand: [],
  localCommand: []
}

const sourcePath = join(__dirname, '../src')
const eventPath = join(__dirname, '../events')
const commandFiles = readdirSync(sourcePath).filter(file => file.endsWith('.js'))
const eventFiles = readdirSync(eventPath).filter(file => file.endsWith('.js'))

for(const file of commandFiles) {
  const com = require(`../src/${file}`)
  if (com.test) {
    commands.localCommand.push(com.data.toJSON())
  } else {
    commands.globalCommand.push(com.data.toJSON())
  }
}

for(const file of eventFiles) {
  const eve = require(`../events/${file}`)
  events.push(eve)
}

const commandsTable = {
  Globals: commands.globalCommand.map(com => com.name),
  Locals: commands.localCommand.map(com => com.name)
}

console.table(commandsTable)
console.table(events, ['name'])

module.exports = {
  command: commands,
  event: events
}
