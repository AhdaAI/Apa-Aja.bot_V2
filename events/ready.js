const { connect } = require('mongoose')
require('dotenv').config()

module.exports = {
    name: 'ready',
    once: true,

    async execute() {
        console.log(`Connecting to mongodb...`)
        connect(process.env.mongodb, {
            keepAlive: true
        })
            .then(() => console.log('Connection established...'))
            .catch(console.error)

        console.log('=== Apa_Aja.Bot version 2 ===')
    }
}