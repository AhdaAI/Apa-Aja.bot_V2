const { SlashCommandBuilder } = require("discord.js");
const model = require("../../databaseModel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Adding or removing role for a user."),

  /**
   *
   * @param {import("discord.js").Interaction} Inter
   */
  async execute(Inter) {
    throw new Error("testing purpose");
    await Inter.reply({
      ephemeral: true,
      content: "Work on proggress",
    });
  },
};
