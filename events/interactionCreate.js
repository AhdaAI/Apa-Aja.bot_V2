const {
  Interaction,
  codeBlock,
  TextInputStyle,
  EmbedBuilder,
  underscore,
} = require("discord.js");
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
        console.log(e);
        const serverId = await interact.guildId;
        const server =
          (await model.findOne({ server: serverId }).exec()) ?? false;

        if (!(await interact.replied)) {
          await interact.reply({
            content: codeBlock(
              `Code: ${e.code}\nMessage: ${e.message}\nStatus: ${e.status}`
            ),
            ephemeral: true,
          });
        } else {
          await interact.followUp({
            content: codeBlock(
              `Code: ${e.code}\nMessage: ${e.message}\nStatus: ${e.status}`
            ),
            ephemeral: true,
          });
        }

        if (server) {
          const { setup } = await server;
          const log = setup.logsID
            ? await interact.guild.channels.fetch(setup.logsID)
            : false;
          if (!log) return;

          const fancy = new EmbedBuilder()
            .setTitle("Error log")
            .setDescription(e.status ?? "-")
            .setColor("DarkRed")
            .setFooter({ text: `code: ${e.code}` });
          fancy.addFields({
            name: underscore("Message"),
            value: codeBlock(e),
            inline: false,
          });
          await log.send({
            embeds: [fancy],
          });
        } else {
          return await interact.followUp({
            content: codeBlock("Error: No database."),
            ephemeral: true,
          });
        }
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
        const edit = await server.embed.filter((f) => f.name == values[0]);

        const option = {
          base: edit,
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
