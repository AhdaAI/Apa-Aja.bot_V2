const { ActivityType } = require('discord.js')
const { connect } = require('mongoose')
const client = require('../index')
require('dotenv').config()

module.exports = {
    name: 'ready',
    once: false,

    async execute() {
        // client.user.setActivity({
        //     type: ActivityType.Listening,
        //     name: '/'
        // })

        console.log(`Connecting to mongodb...`)
        connect(process.env.LOGIN, {
            keepAlive: true
        })
            .then(() => console.log('Connection established...'))
            .catch(console.error)

        console.log('=== Apa_Aja.Bot version 2 ===')
    }
}