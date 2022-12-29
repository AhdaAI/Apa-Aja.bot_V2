const { SlashCommandBuilder, PermissionsBitField, Interaction, codeBlock } = require("discord.js");
const model = require('../db')

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
    const server_id = await Inter.guild.id
    if(!await Inter.options.data[0]) {
      await Inter.reply({
        content: `Example:\n${codeBlock('add role: @test benefit: [+] Text & Voice Channel')}`,
        ephemeral: true
      })
      return
    }
    const role = await Inter.options.data[0].role
    const desc = await Inter.options.data[1]? await Inter.options.data[1].value : '[+] Text & Voice Channel'
    /*
      if else statement in a single line

      [condition] ([if true execute] : [else execute])

      can be stacked
    */

    const server = await model.findOne({server: server_id}).exec()
    if(!server) {
      await Inter.reply({
        ephemeral: true,
        content: codeBlock(`Failed to find server, Please create new database for this server.\nCommand /create`)
      })
      return
    }
    await Inter.reply({
      ephemeral: true,
      content: 'Adding role to database...'
    })
    let check = await server.roles.filter(r => r.name === role.name)
    if(check) {
      await server.roles.push({
        name : role.name,
        description : desc,
        id : role.id
      })
      await server.save()
    }

    await Inter.editReply({
      ephemeral: true,
      content: 'Successfully added role to database'
    })
  }
}