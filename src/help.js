const { SlashCommandBuilder, codeBlock, EmbedBuilder } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Sending help from the nearest hospital.")
    .addSubcommand((subCom) =>
      subCom.setName("embed").setDescription("Get embed help")
    )
    .addSubcommand((subCom) =>
      subCom.setName("setup").setDescription("Get setup help")
    )
    .addSubcommand((subCom) =>
      subCom.setName("role").setDescription("Get roles commands")
    ),
  test: true,

  /**
   *
   * @param {import("discord.js").Interaction} interaction
   */
  async execute(interaction) {
    const { options } = await interaction;
    const guild = await interaction.guild;

    if (options.getSubcommand() == "embed") {
      await interaction.reply({
        content: "Currently unavailabel",
        ephemeral: true,
      });
      return;
    }
    if (options.getSubcommand() == "setup") {
      const fancy = new EmbedBuilder()
        .setTitle("Setup Help")
        .setDescription("[Admin Only] Setting up bot for current server.")
        .setFooter({
          iconURL: guild.iconURL(),
          text: "Default command: /setup",
        });

      fancy.addFields({
        name: "__*OPTION*__",
        value:
          codeBlock(`logs\t\t: A channel to logs error and unexpected failure.
        \nrole_channel: A channel to display the panel and select menu for role selection.
        \nshort_desc  : A short description of the server to displayed on the embed description.`),
        inline: false,
      });

      fancy.addFields({
        name: "__*OPTION TYPE*__",
        value: codeBlock(`logs\t\t: CHANNEL_TYPE.GuildText
        \nrole_channel: CHANNEL_TYPE.GuildText
        \nshort_desc  : String`),
        inline: true,
      });

      fancy.addFields({
        name: "__*Documentation*__",
        value:
          "[Discord.js Channel type](https://discord.com/developers/docs/resources/channel#channel-object-channel-types)",
        inline: true,
      });

      await interaction.reply({
        embeds: [fancy],
        ephemeral: true,
      });
      return;
    }

    if (options.getSubcommand() == "role") {
      await interaction.reply({
        content: "Currently unavailable.",
        ephemeral: true,
      });
    }
  },
};
