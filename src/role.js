const { SlashCommandBuilder } = require("discord.js");
const model = require('../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Adding or removing role for a user.'),

    /**
     * 
     * @param {import("discord.js").Interaction} Inter 
     */
  async execute(Inter) {
    await Inter.reply({
      ephemeral: true,
      content: 'Work on proggress'
    })
  }
}