const {
  SlashCommandBuilder,
  PermissionsBitField,
  codeBlock,
  ChannelType,
} = require("discord.js");
const model = require("../databaseModel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setting up discord server")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addChannelOption((option) =>
      option
        .setName("logs")
        .setDescription(`Channel's id for logged information`)
        .setRequired(false)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addChannelOption((option) =>
      option
        .setName("role_channel")
        .setDescription("Channel to display dropdown menu to select roles")
        .setRequired(false)
        .addChannelTypes(ChannelType.GuildText)
    ),
  test: true,
  /**
   *
   * @param {import("discord.js").Interaction} interaction
   */
  async execute(interaction) {
    const logs = (await interaction.options.data)
      ? await interaction.options.getChannel("logs")
      : false;
    const role = (await interaction.options.data)
      ? await interaction.options.getChannel("role_channel")
      : false;
    const serverId = await interaction.guildId;
    const res = [];

    const server = (await model.findOne({ server: serverId }).exec())
      ? await model.findOne({ server: serverId }).exec()
      : false;
    if (!server) {
      await interaction.reply({
        content: `Please create new database (/create)`,
        ephemeral: true,
      });
      return;
    }

    const { setup } = await server;
    if (!logs) {
      res.push("[?] Logs channel not found.");
    } else {
      setup.logsID = logs.id;
    }

    if (!role) {
      res.push("[?] Role channel not found.");
    } else {
      setup.roleChannel = role.id;
    }

    await server.save();

    if (res.length != 0) {
      await interaction.reply({
        content: codeBlock(res.join("\n")),
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      content: codeBlock(`Settings configured.`),
      ephemeral: true,
    });
  },
};
