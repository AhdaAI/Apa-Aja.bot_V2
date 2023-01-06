const {
  SlashCommandBuilder,
  PermissionsBitField,
  codeBlock,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");
const model = require("../databaseModel");
const { builder } = require("../utils/builder");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("init")
    .setDescription("Initializing settings")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

  test: true,

  /**
   *
   * @param {import("discord.js").Interaction} interaction
   */
  async execute(interaction) {
    const serverId = await interaction.guildId;
    const server = (await model.findOne({ server: serverId }).exec())
      ? await model.findOne({ server: serverId }).exec()
      : false;

    if (!server) {
      await interaction.reply({
        content: codeBlock(`Failed to find server in database.`),
        ephemeral: true,
      });
      return;
    }

    if (server.roles.length <= 1) {
      await interaction.reply({
        content: codeBlock(`${server.roles.length} Registered role.`),
        ephemeral: true,
      });
      return;
    }

    const { setup, roles } = await server;
    if (!setup.roleChannel) {
      await interaction.reply({
        content: "Role channel undefine, creating new text channel for role",
        ephemeral: true,
      });
    }
    const channelRole = setup.roleChannel
      ? await interaction.guild.channels.fetch(setup.roleChannel)
      : await interaction.guild.channels.create({
          name: "role",
          type: ChannelType.GuildText,
          parent: null,
        });

    const options = roles.map((r) => {
      return {
        label: r.name,
        description: r.description,
        value: r.id,
      };
    });
    const dropD = new builder("panel").selectMenu(options, "Choose one role");

    const embedData = {
      title: await interaction.guild.name,
      description: setup.shortDesc ? setup.shortDesc : null,
    };
    const fancy = new EmbedBuilder(embedData);

    await channelRole.send({
      embeds: [fancy],
      components: [dropD],
    });
  },
};
