const {
  SlashCommandBuilder,
  PermissionsBitField,
  codeBlock,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");
const model = require("../databaseModel");

module.exports = {
  help: {
    function: "Settings all needed function.",
    command: "/Settings [Optional Command]",
    required: "none",
  }, // help description
  data: new SlashCommandBuilder()
    .setName("settings")
    .setDescription("/Settings to display current settings.")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator) // adding permission
    .addStringOption((option) =>
      option
        .setName("option")
        .setDescription("Setting option")
        .setRequired(true)
        .setChoices(
          { name: "Display", value: "display" }, // implemented
          { name: "Logs Channel", value: "logs" },
          { name: "Role Channel", value: "role" },
          { name: "Welcome Channel", value: "welcome" },
          { name: "Server Short Description", value: "desc" }
        )
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Adding channel id.")
        .setRequired(false)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption((option) =>
      option.setName("text").setDescription("Text input.").setRequired(false)
    ),
  /**
   *
   * @param {import("discord.js").Interaction} interaction
   */
  async execute(interaction) {
    const serverId = await interaction.guild.id;
    const options = await interaction.options.getString("option");
    const channel = await interaction.options?.getChannel("channel");
    const data = (await model.findOne({ server: serverId }).exec()) ?? false;

    if (!data) {
      await interaction.reply({
        content: codeBlock("[?] Database unknown."),
        ephemeral: true,
      });
      throw new Error("[?] Database unknown.");
    }

    if (options == "display") {
      if (!data) {
        return await interaction.reply({
          ephemeral: true,
          content: codeBlock("[?] Database not found, /config to configure"),
        });
      }

      const setup = data.setup;
      const logs = await interaction.guild.channels.fetch(setup.logsID);
      const roleCh = await interaction.guild.channels.fetch(setup.roleChannel);
      const welCh = await interaction.guild.channels.fetch(
        setup.welcomeChannel
      );

      const fancy = new EmbedBuilder()
        .setTitle("Settings")
        .setDescription("Current settings.")
        .setFooter({ text: "Your current settings on this server." });

      fancy.addFields({
        name: "Log Channel",
        value: codeBlock(logs.name ?? "Unknown"),
        inline: true,
      });

      fancy.addFields({
        name: "Role Channel",
        value: codeBlock(roleCh.name ?? "Unknown"),
        inline: true,
      });

      fancy.addFields({
        name: "Welcome Channel",
        value: codeBlock(welCh.name ?? "Unknown"),
        inline: true,
      });

      fancy.addFields({
        name: "Server Short Description",
        value: codeBlock(setup.shortDesc ?? undefined),
        inline: false,
      });

      if (data.roles.length >= 1) {
        fancy.addFields({
          name: "Stored role",
          value: codeBlock(data.roles.map((r) => r.name).join("\n")),
          inline: true,
        });

        fancy.addFields({
          name: "Stored role description",
          value: codeBlock(data.roles.map((r) => r.description).join("\n")),
          inline: true,
        });
      }

      return await interaction.reply({ ephemeral: true, embeds: [fancy] });
    }

    if (options == "logs") {
      if (!channel) {
        return await interaction.reply({
          ephemeral: true,
          content: "Please select channel.",
        });
      }

      await interaction.reply({
        ephemeral: true,
        content: "Updating database...",
      });

      const { setup } = await data;
      setup.logsID = channel.id;

      await data.save();

      return await interaction.editReply({
        ephemeral: true,
        content: "Database updated.",
      });
    }

    if (options == "role") {
      if (!channel) {
        return await interaction.reply({
          ephemeral: true,
          content: "Please select channel.",
        });
      }

      await interaction.reply({
        ephemeral: true,
        content: "Updating database...",
      });

      const { setup } = await data;
      setup.roleChannel = channel.id;

      await data.save();

      return await interaction.editReply({
        ephemeral: true,
        content: "Database updated.",
      });
    }

    if (options == "welcome") {
      if (!channel) {
        return await interaction.reply({
          ephemeral: true,
          content: "Please select channel.",
        });
      }

      await interaction.reply({
        ephemeral: true,
        content: "Updating database...",
      });

      const { setup } = await data;
      setup.welcomeChannel = channel.id;

      await data.save();

      return await interaction.editReply({
        ephemeral: true,
        content: "Database updated.",
      });
    }

    if (options == "desc") {
      await interaction.reply({
        ephemeral: true,
        content: "Updating database...",
      });

      const sDesc =
        (await interaction.options.getString("text")) ??
        "Welcome to our random and awesome server.";

      const { setup } = await data;
      setup.shortDesc = sDesc;

      await data.save();

      return await interaction.editReply({
        ephemeral: true,
        content: "Database updated.",
      });
    }

    return await interaction.reply({
      ephemeral: true,
      content: codeBlock("Something went wrong."),
    });
  },
};
