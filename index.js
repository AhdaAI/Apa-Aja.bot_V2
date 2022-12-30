const { Client } = require('discord.js')
const { env } = require('process')
const { start } = require('./utils/deployScript')
require('dotenv').config()

const { TOKEN } = env

const client = new Client({intents: 131071})
module.exports = { client }
start(client)
client.login(TOKEN)