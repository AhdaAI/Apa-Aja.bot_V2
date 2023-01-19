const { GuildMember, EmbedBuilder, codeBlock } = require("discord.js");
const model = require("../databaseModel");

module.exports = {
  name: "guildMemberAdd",
  once: false,

  /**
   *
   * @param {GuildMember} member
   */
  async execute(member) {
    const user = await member.user;
    const guild = await member.guild;
    const allMember = guild.members.fetch();
    const server = (await model.findOne({ server: guild.id }).exec()) ?? false;

    if (!server) {
      console.log(`Failed to find server ${guild.id}`);
    }

    const fancy = new EmbedBuilder()
      .setTitle(`Welcome to ${guild.name}`)
      .setDescription(server.setup.shortDesc ?? "Just a humble server.")
      .setFooter({
        iconURL: guild.iconURL(),
        text: "Type /help for more help.",
      })
      .setThumbnail(guild.iconURL());

    fancy.addFields({
      name: "Member Count",
      value: codeBlock(
        `Member : ${
          (await allMember).filter((user) => !user.user.bot).size
        }\nBot\t: ${
          (await allMember).filter((user) => user.user.bot).size
        }\nTotal Member: ${allMember.size}`
      ),
      inline: true,
    });

    fancy.addFields({
      name: "Information",
      value: codeBlock(`Owner: ${guild.fetchOwner()}
      \nAvailable role: `),
      inline: true,
    });

    const channel = await member.guild.channels.cache;
    console.log(channel);
    await channel.send({
      embeds: [fancy],
    });
  },
};
