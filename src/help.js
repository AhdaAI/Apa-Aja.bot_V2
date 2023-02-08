const {
  SlashCommandBuilder,
  codeBlock,
  EmbedBuilder,
  underscore,
} = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");

const data = [];
const commands = readdirSync(__dirname).filter((file) => file.endsWith(".js"));
for (file of commands) {
  if (file == "help.js") {
    continue;
  }
  const com = require(`./${file}`);
  const parsed = com.data.toJSON();

  data.push({
    name: parsed.name,
    value: parsed.name,
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Sending help from the nearest hospital.")
    .addStringOption((option) => {
      const option_data = option
        .setName("commands")
        .setDescription("Commands list")
        .setRequired(true);
      data.forEach((choice) => option_data.addChoices(choice));
      return option_data;
    }),

  /**
   *
   * @param {import("discord.js").Interaction} interaction
   */
  async execute(interaction) {
    const { options } = await interaction;
    const guild = await interaction.guild;

    const string = options.getString("commands");
    const com = require(`./${string}.js`);
    const help = com.help;
    const fancy = new EmbedBuilder()
      .setTitle(`Help on the way.`)
      .setDescription("The help that you need.")
      .setFooter({ text: "/help for more." });

    fancy.addFields({
      name: underscore(string),
      value: codeBlock(help.function),
      inline: false,
    });

    fancy.addFields({
      name: underscore("Command"),
      value: codeBlock(help.command),
      inline: true,
    });

    if (help.required != "none") {
      fancy.addFields({
        name: underscore("Required"),
        value: codeBlock(help.required),
        inline: true,
      });
    }

    await interaction.reply({
      embeds: [fancy],
      ephemeral: true,
    });
  },
};
