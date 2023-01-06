const { SlashCommandBuilder, codeBlock } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Sending help from the nearest hospital."),
  test: true,

  /**
   *
   * @param {import("discord.js").Interaction} interaction
   */
  async execute(interaction) {
    const command = readdirSync(join(__dirname, "../src"));
    const list = [];
    command.map((com) => {
      const temp = require(`../src/${com}`);
      if (!temp.test) {
        list.push(temp.data.name);
      }
    });
    await interaction.reply({
      content: codeBlock(`Available commands: ${list.join(", ")}`),
      ephemeral: true,
    });
  },
};
