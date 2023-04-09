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
      .setThumbnail(user.avatarURL() ?? guild.iconURL());

    const userTime = user.createdAt.toDateString();
    fancy.addFields({
      name: "USER",
      value: codeBlock(`Name   : ${user.username}\nDiscord: ${userTime}`),
      inline: true,
    });

    fancy.addFields({
      name: "MEMBER COUNT",
      value: codeBlock(
        `Member : ${
          (await allMember).filter((user) => !user.user.bot).size
        }\nBot\t: ${
          (await allMember).filter((user) => user.user.bot).size
        }\nTotal  : ${allMember.size}`
      ),
      inline: true,
    });

    if (server.roles.length >= 1) {
      const listed = server.roles.map((r) => r.name).join("\n");
      fancy.addFields({
        name: "AVAILABEL ROLES",
        value: codeBlock(listed),
        inline: false,
      });
    }

    const channel = server.setup.welcomeChannel
      ? await guild.channels.fetch(server.setup.welcomeChannel)
      : false;
    if (channel) {
      await channel.send({
        embeds: [fancy],
      });
    }
  },
};
