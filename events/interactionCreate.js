const { Interaction, codeBlock, TextInputStyle } = require("discord.js");
const channels = require("../utils/channel.json");
const { client } = require("../index");
const model = require("../databaseModel");
const { builder } = require("../utils/builder");

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

    if (interact.isAnySelectMenu()) {
      const { customId, member, values, guildId } = interact;

      if (customId == "role") {
        const role = await interact.guild.roles.fetch(values[0]);
        (await member.roles.cache.some((r) => r.name == role.name))
          ? await member.roles.remove(role)
          : await member.roles.add(role);
        await interact.update({ content: " " });
        await interact.followUp({
          content: codeBlock(
            `Add ${role.name}: ${member.roles.cache.some(
              (r) => r.name === role.name
            )}`
          ),
          ephemeral: true,
        });
      }

      if (customId == "fieldEdit") {
        const server = await model.findOne({ server: guildId }).exec();
        const edit = server.embed.filter((f) => f.name == values[0]);

        const option = {
          id: edit.name,
          label: edit.name,
          style: TextInputStyle.Paragraph,
        };
        const mod = new builder("fieldEdit").modal("Editor", option);

        await interact.reply({
          content: " ",
          components: [mod],
        });
      }
    }
  },
};
