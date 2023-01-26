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
    const allMember = guild.members.cache;
    const server = (await model.findOne({ server: guild.id }).exec()) ?? false;

    if (!server) {
      console.log(`[!] Failed to find server ${guild.id}`);
      return;
    }

    const fancy = new EmbedBuilder()
      .setTitle(`Welcome to ${guild.name}`)
      .setDescription(server.setup.shortDesc ?? "Just a humble server.")
      .setFooter({
        iconURL: guild.iconURL(),
        text: "Type /help for more help.",
      })
      .setThumbnail(guild.iconURL());

    const userTime = user.createdAt;
    fancy.addFields({
      name: "__USER__",
      value: codeBlock(
        `Name   : ${user.username}\nDiscord: ${userTime.getFullYear()}`
      ),
      inline: true,
    });

    fancy.addFields({
      name: "MEMBER COUNT",
      value: codeBlock(
        `Member : ${
          (await allMember).filter((user) => !user.user.bot).size
        }\nBot\t: ${
          (await allMember).filter((user) => user.user.bot).size
        }\nTotal Member: ${allMember.size}`
      ),
      inline: true,
    });

    const channel = await guild.channels.fetch(server.setup.welcomeChannel);
    await channel.send({
      embeds: [fancy],
    });
  },
};
