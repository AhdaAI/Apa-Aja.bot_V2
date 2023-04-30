const {
  SlashCommandBuilder,
  PermissionsBitField,
  codeBlock,
} = require("discord.js");
const model = require("../databaseModel");

module.exports = {
  help: {
    function: "Removing a role from database.",
    command: `/remove [role]
      role         : The desire role to remove.`,
    required: "database",
  },
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setName("remove")
    .setDescription("Removing role.")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role you want to remove")
        .setRequired(true)
    ),

  /**
   *
   * @param {import("discord.js").Interaction} Interaction
   */
  async execute(Interaction) {
    const server_id = await Interaction.guild.id;
    const role = await Interaction.options.data[0].role;

    const server = (await model.findOne({ server: server_id }).exec()) ?? false;

    if (!server) {
      await Interaction.reply({
        ephemeral: true,
        content: codeBlock(
          `Failed to find server, Please create new database for this server.\nCommand /create`
        ),
      });
      return;
    }

    await Interaction.reply({
      ephemeral: true,
      content: codeBlock("Processing..."),
    });

    let check = await server.roles.filter((r) => r.name === role.name);
    let length = server.roles.length;
    while (length-- && check) {
      if (server.roles[length].name === role.name) {
        server.roles.splice(length, 1);
        await server.save();
        return await Interaction.editReply({
          ephemeral: true,
          content: codeBlock(`Role "${role.name}" deleted.`),
        });
      }
    }

    return await Interaction.editReply({
      ephemeral: true,
      content: codeBlock(`Role not found, role: ${role.name}`),
    });
  },
};
