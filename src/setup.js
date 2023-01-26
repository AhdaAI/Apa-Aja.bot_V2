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
    )
    .addChannelOption((option) =>
      option
        .setName("welcome_channel")
        .setDescription("For member join events")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("short_desc")
        .setDescription("Add short description to your server.")
        .setRequired(false)
    ),
  test: true,
  /**
   *
   * @param {import("discord.js").Interaction} interaction
   */
  async execute(interaction) {
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

    const logs = (await interaction.options.getChannel("logs"))
      ? (setup.logsID = await interaction.options.getChannel("logs").id)
      : false;
    const role = (await interaction.options.getChannel("role_channel"))
      ? (setup.roleChannel = await interaction.options.getChannel(
          "role_channel"
        ).id)
      : false;
    const shortDesc = (await interaction.options.getString("short_desc"))
      ? (setup.shortDesc = await interaction.options.getString("short_desc"))
      : false;
    const welcome = (await interaction.options.getChannel("welcome_channel"))
      ? (setup.welcomeChannel = await interaction.options.getChannel(
          "welcome_channel"
        ).id)
      : false;

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
