const {
  SlashCommandBuilder,
  PermissionsBitField,
  Interaction,
} = require("discord.js");
const model = require("../databaseModel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create")
    .setDescription("Creating new database entry")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDMPermission(false),

  /**
   *
   * @param {Interaction} Inter
   */
  async execute(Inter) {
    const server_id = await Inter.guildId;
    const check = await model.findOne({ server: server_id }).exec();
    if (check) {
      await Inter.reply({
        ephemeral: true,
        content: "Server already created",
      });
      return;
    }

    new model({
      server: server_id,
    }).save();

    await Inter.reply({
      ephemeral: true,
      content: "=== Server has been created ===",
    });
  },
};
