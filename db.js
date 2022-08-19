const { Schema, model } = require('mongoose');

const db = new Schema({
    server: Number,
    roles: [{
        name: String,
        description: String,
        id: String
    }]
})

module.exports = model('role', db)