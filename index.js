const { Client, REST, Routes, Collection } = require("discord.js")
const path = require("path")
const fs = require("fs")
require('dotenv').config()

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN)
const client = new Client({intents: 131071})
module.exports = client

const events = path.join(__dirname, "events")
const source = path.join(__dirname, "src")
const events_files = fs.readdirSync(events).filter(file => file.endsWith('.js'))
const command_files = fs.readdirSync(source).filter(file => file.endsWith('.js'))

//events
for(file of events_files) {
    try {
        console.log(`Creating event for ${file}`)
        const file_path = path.join(events, file)
        const event = require(file_path)

        if(event.once) {
            client.once(event.name, async(...args) => event.execute(...args))
        } else {
            client.on(event.name, async(...args) => event.execute(...args))
        }
    } catch(e) {
        console.log(e)
    }
}

//commands
client.commands = new Collection()
const commands = []
for(file of command_files) {
    console.log(`Creating command for ${file}`)
    const file_path = path.join(source, file)
    const command = require(file_path)

    try {
        client.commands.set(command.data.name, command)
        commands.push(command.data.toJSON())
    } catch(e) {
        console.log(e)
    }
}

const client_id = '1009763088062484543'
rest.put(Routes.applicationCommands(client_id), { body: commands })
    .then(() => console.log(`Successfully registered application commands.`))
    .catch(console.error)

client.login(process.env.TOKEN)