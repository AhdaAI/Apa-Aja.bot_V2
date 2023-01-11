const {
  SlashCommandBuilder,
  PermissionsBitField,
  codeBlock,
} = require("discord.js");
const model = require("../databaseModel");
const { builder } = require("../utils/builder");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDescription("To create new field on embeds")
    .addSubcommand((subCom) =>
      subCom
        .setName("create")
        .setDescription("Creating new field")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The title of field")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("value")
            .setDescription("The content of field")
            .setRequired(true)
        )
        .addBooleanOption((option) =>
          option
            .setName("inline")
            .setDescription("The position of field. Default: true")
            .setRequired(false)
        )
    )
    .addSubcommand((subCom) =>
      subCom.setName("edit").setDescription("Edit current embeds field.")
    ),

  test: true,
  /**
   *
   * @param {import("discord.js").Interaction} interaction
   */
  async execute(interaction) {
    const serverId = await interaction.guildId;
    const server = await model.findOne({ server: serverId }).exec();
    if (interaction.options.getSubcommand() == "create") {
      const data = {
        name: await interaction.options.getString("name"),
        value: await interaction.options.getString("value"),
        inline: (await interaction.options.getBoolean("inline")) ?? true,
      };

      try {
        await server.embed.push(data);
        await server.save();
        await interaction.reply({
          content: codeBlock("Created"),
        });
      } catch (e) {
        await interaction.reply({
          content: codeBlock(
            `Something went wrong.\ncode: ${e.code}\nmessage: ${e.message}\nstatus: ${e.status}`
          ),
        });
      }
    }
    if (interaction.options.getSubcommand() == "edit") {
      const data = server.embed;
      const option = data.map((r) => {
        return {
          label: r.name,
          value: r.name,
        };
      });
      const dropD = new builder("fieldEdit").selectMenu(option, "Select Field");
      await interaction.reply({
        content: codeBlock("Select one of the field name to edit"),
        components: [dropD],
      });
    }
  },
};
