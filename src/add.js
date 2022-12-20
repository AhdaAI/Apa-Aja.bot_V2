const { SlashCommandBuilder, PermissionsBitField, Interaction } = require("discord.js");
const interactionCreate = require("../events/interactionCreate");

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setName('add')
    .setDescription('Adding new role')
    .addRoleOption(option => 
      option.setName('role')
        .setDescription('The role you want to add')
        .setRequired(false)
    )
    .addStringOption(option => 
      option.setName('benefit')
        .setDescription('default: [+] Text & Voice Channel')
        .setRequired(false)
    ),
  
  /**
   * 
   * @param {Interaction} Inter 
   */
  async execute(Inter) {
    
  }
}