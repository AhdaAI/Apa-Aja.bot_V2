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
const panel = require("../panel");
const eventJoin = require("../../events/memberJoin");

module.exports = {
  help: {
    function:
      "Deploy panel command at designated place and test the welcome feature.",
    command: "/deploy [options]",
    required: "database\nlogs channel\nwelcome channel\nrole channel",
  },
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
      panel: (await interaction.options.getBoolean("panel")) ?? true,
      welcome: (await interaction.options.getBoolean("welcome")) ?? true,
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
    if (!setup.logsID && !setup.roleChannel && !setup.welcomeChannel) {
      await interaction.reply({
        content: "Please create a setup.",
      });
      return;
    }

    const fancy = new EmbedBuilder()
      .setTitle(guild.name)
      .setDescription(setup.shortDesc ?? "Lovely... yes its a lovely server.")
      .setThumbnail(guild.iconURL())
      .setFooter({
        text: "/help for more help.",
        iconURL: guild.iconURL(),
      });

    const logsChannel = setup.logsID
      ? await guild.channels.fetch(setup.logsID)
      : false;

    const panelChannel = setup.roleChannel
      ? await guild.channels.fetch(setup.roleChannel)
      : (data.panel = false);

    const welcomeChannel = setup.welcomeChannel
      ? await guild.channels.fetch(setup.welcomeChannel)
      : (data.welcome = false);

    // const test = new EmbedBuilder()
    //   .setTitle("Current status.")
    //   .setDescription(setup.shortDesc ?? "Such a lovely day.")
    //   .setFooter({ text: "/embed to add new embed" });

    // test.addFields({
    //   name: underscore("Member"),
    //   value: codeBlock(`Total member: ${guild.members.cache.size}`),
    //   inline: true,
    // });

    // if (server.roles.length >= 1) {
    //   test.addFields({
    //     name: underscore(`${server.roles.length} Available role`),
    //     value: codeBlock(server.roles.map((r) => r.name).join("\n")),
    //     inline: true,
    //   });
    // }

    // Testing custom embed
    // if (server.embed >= 1) {
    //   for (let em of server.embed) {
    //     fancy.addFields({
    //       name: em.name,
    //       value: codeBlock(em.value),
    //       inline: em.inline,
    //     });

    //     test.addFields({
    //       name: em.name,
    //       value: codeBlock(em.value),
    //       inline: em.inline,
    //     });
    //   }
    // }

    const err = [];

    if (data.welcome) {
      const user = await interaction.member;
      try {
        eventJoin.execute(user);
      } catch (e) {
        err.push(`${e.code}\n${e.message}`);
      }
    }

    if (data.panel) {
      try {
        await panel.execute(interaction);
      } catch (e) {
        err.push(`${e.code}\n${e.message}`);
      }
    }

    if (logsChannel) {
      await logsChannel.send({
        content: codeBlock(
          `Code: 200\nMessage: Everythings working.\nStatus: OK`
        ),
      });
    }

    if (err.length != 0) {
      await interaction.reply({
        content: "Error has occured",
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      content: "Code deployed.",
      ephemeral: true,
    });
  },
};
