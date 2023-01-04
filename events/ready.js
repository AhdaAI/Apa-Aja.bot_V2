const mongoose = require('mongoose')
const { ActivityType } = require('discord.js')
const client = require('../index')
require('dotenv').config()

module.exports = {
  name: 'ready',
  once: false,

  async execute() {
    console.log('=== Started and ready to use ===')
    console.log('[+] Apa-Aja.bot v2.0.1')
    
    mongoose.set('strictQuery', true)
    mongoose.connect(process.env.LOGIN, {
      keepAlive: true
    }).then(() => console.log('[+] Connected to mongodb'))
    .catch(e => console.log(e))
  }
}