const { Client, ActivityType } = require('discord.js')
const { env } = require('process')
const { start } = require('./utils/deployScript')
require('dotenv').config()

const { TOKEN } = env

const client = new Client({
  intents: 131071,
  presence: {
    activities: [{name: '/', type: ActivityType.Listening}]
  }
})

try {
  start(client)
} catch (err) {
  console.log(err)
}

client.login(TOKEN)