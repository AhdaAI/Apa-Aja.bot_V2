const {
  SlashCommandBuilder,
  PermissionsBitField,
  codeBlock,
  EmbedBuilder,
  bold,
} = require("discord.js");
const model = require("../databaseModel");
const builder = require("../utils/builder");

module.exports = {
  help: {
    function: "Configure all needed channel.",
    command: "/config",
    required: "none",
  }, // help description
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Configuring server.")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator), // adding permission

  /**
   *
   * @param {import("discord.js").Interaction} interaction
   */
  async execute(interaction) {
    const channels = await interaction.guild.channels.cache;
    const serverId = await interaction.guildId;
    const server =
      (await model.findOne({ server: serverId }).exec()) ??
      new model({ server: serverId });

    const fancy = new EmbedBuilder()
      .setTitle("Configurating...")
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.avatarURL(),
      })
      .setColor("DarkOrange");

    const fields = [
      {
        name: "Welcome Channel",
        value: codeBlock(`⏳ Locating...`),
        inline: true,
      },
      {
        name: "Role Channel",
        value: codeBlock(`⏳ Locating...`),
        inline: true,
      },
      {
        name: "Log Channel",
        value: codeBlock(`⏳ Locating...`),
        inline: true,
      },
    ];

    fancy.setFields(fields);

    await interaction.reply({ embeds: [fancy] });

    let data = {
      logsID: undefined,
      roleChannel: undefined,
      welcomeChannel: undefined,
    };

    channels.forEach((ch) => {
      if (ch.name == "welcome") {
        // fields[0].value = codeBlock("✔ Found.");
        data.welcomeChannel = ch.id;
      }

      if (ch.name == "role") {
        // fields[1].value = codeBlock("✔ Found.");
        data.roleChannel = ch.id;
      }

      if (ch.name == "log") {
        // fields[2].value = codeBlock("✔ Found.");
        data.logsID = ch.id;
      }
    });

    fields.forEach((fl) => {
      if (data.logsID && fl.name == "Log Channel") {
        fl.value = codeBlock("✔ Found.");
      } else if (data.logsID == undefined) {
        fl.value = codeBlock("❌ Not Found.");
      }

      if (data.roleChannel && fl.name == "Role Channel") {
        fl.value = codeBlock("✔ Found.");
      } else if (data.roleChannel == undefined) {
        fl.value = codeBlock("❌ Not Found.");
      }

      if (data.welcomeChannel && fl.name == "Welcome Channel") {
        fl.value = codeBlock("✔ Found.");
      } else if (data.welcomeChannel == undefined) {
        fl.value = codeBlock("❌ Not Found.");
      }
    });

    fancy.setTitle("Configured");
    fancy.setFields(fields);
    fancy.setColor("DarkGreen");
    fancy.setFooter({ text: `/settings for more options` });

    setTimeout(async () => {
      server.setup = data;
      await server.save();
      interaction.editReply({ embeds: [fancy] });
    }, 3000);
  },
};
