const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  codeBlock,
  underscore,
} = require("discord.js");
const model = require("../../databaseModel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deploy")
    .setDescription("Easy way to deploy your setup.")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addBooleanOption((option) =>
      option
        .setName("panel")
        .setDescription("Deploy the panel.")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("welcome")
        .setDescription("Deploy the panel.")
        .setRequired(false)
    ),

  /**
   *
   * @param {import("discord.js").Interaction} interaction
   */
  async execute(interaction) {
    const data = {
      panel: (await interaction.options.getBoolean("panel")) ?? false,
      welcome: (await interaction.options.getBoolean("welcome")) ?? false,
    };

    const guild = await interaction.guild;
    const server = (await model.findOne({ server: guild.id }).exec()) ?? false;
    if (!server) {
      await interaction.reply({
        content: "Database not found.",
        ephemeral: true,
      });
      return;
    }

    const { setup } = server;
    const fancy = new EmbedBuilder()
      .setTitle(guild.name)
      .setDescription(setup.shortDesc ?? "Lovely... yes its a lovely server.")
      .setThumbnail(guild.iconURL())
      .setFooter({
        text: "/help for more help.",
        iconURL: guild.iconURL(),
      });

    const res = [];
    const logsChannel = setup.logsID
      ? await guild.channels.fetch(setup.logsID)
      : false;

    const panelChannel = setup.roleChannel
      ? await guild.channels.fetch(setup.roleChannel)
      : false;

    const welcomeChannel = setup.welcomeChannel
      ? await guild.channels.fetch(setup.welcomeChannel)
      : false;

    const test = new EmbedBuilder()
      .setTitle("Current status.")
      .setDescription(setup.shortDesc ?? "Such a lovely day.")
      .setFooter({ text: "/embed to add new embed" });

    test.addFields({
      name: underscore("Member"),
      value: codeBlock(`Total member: ${guild.members.cache.size}`),
      inline: true,
    });

    if (server.roles.length >= 1) {
      test.addFields({
        name: underscore(`${server.roles.length} Available role`),
        value: codeBlock(server.roles.map((r) => r.name).join("\n")),
        inline: true,
      });
    }

    if (server.embed >= 1) {
      for (let em of server.embed) {
        fancy.addFields({
          name: em.name,
          value: codeBlock(em.value),
          inline: em.inline,
        });

        test.addFields({
          name: em.name,
          value: codeBlock(em.value),
          inline: em.inline,
        });
      }
    }

    if (welcomeChannel) {
      await welcomeChannel.send({
        embeds: [test],
      });
    }

    if (logsChannel) {
      await logsChannel.send({
        content: codeBlock(
          `Code: 200\nMessage: Everythings working.\nStatus: OK`
        ),
      });
    }

    if (panelChannel) {
      if (server.roles.length >= 1) {
        const drop = new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("role")
            .setPlaceholder("Select role...")
            .addOptions(
              server.roles.map((r) => {
                return {
                  label: r.name,
                  description: r.description,
                  value: r.id,
                };
              })
            )
        );
        await panelChannel.send({
          embeds: [fancy],
          components: [drop],
        });
      } else {
        await panelChannel.send({
          embeds: [fancy],
        });
      }
    }

    await interaction.reply({
      content: "Code deployed.",
      ephemeral: true,
    });
  },
};
