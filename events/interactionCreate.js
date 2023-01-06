const { Interaction, codeBlock } = require("discord.js");
const channels = require("../utils/channel.json");
const { client } = require("../index");
const model = require("../databaseModel");

module.exports = {
  name: "interactionCreate",
  once: false,

  /**
   * @param {Interaction} interact
   */
  async execute(interact) {
    if (interact.isChatInputCommand()) {
      const command = client.commands.get(interact.commandName);

      // Handling unknown interactions
      if (!command) {
        return await interact.reply({
          ephemeral: true,
          content: codeBlock("Error: Command not found!"),
        });
      }

      // Handling Known interaction
      try {
        await command.execute(interact);
      } catch (e) {
        const serverId = await interact.guildId;
        const server = (await model.findOne({ server: serverId }).exec())
          ? await model.findOne({ server: serverId }).exec()
          : false;

        const { setup } = await server;
        const log = await interact.guild.channels.fetch(setup.logsID);
        try {
          await interact.reply({
            content: "Error: Command failed to interact",
            ephemeral: true,
          });
        } catch (e) {
          await log.send({
            content: codeBlock(
              `Code: ${e.code}\nMessage: ${e.message}\nStatus: ${e.status}`
            ),
          });
        }
        await log.send({
          content: codeBlock(
            `Code: ${e.code}\nMessage: ${e.message}\nStatus: ${e.status}`
          ),
        });
        console.log(e);
      }
    }
  },
};
