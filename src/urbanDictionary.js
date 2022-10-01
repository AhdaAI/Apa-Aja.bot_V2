const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require("discord.js");
const { request } = require("undici");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('urban')
    .setDescription('Return what Urban Dictionary think about a word.')
    .addStringOption(
      option => option.setName('word')
        .setDescription('Type a word or sentences')
        .setRequired(true)
    ),

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
  async execute(interaction) {
    await interaction.deferReply()

    const term = await interaction.options.data[0].value
    const query = new URLSearchParams({ term })

    async function getJSONResponse(body) {
      let fullbody = ''
      for await (const data of body) {
        fullbody += data.toString()
      }

      return JSON.parse(fullbody)
    }

    const dict = await request(`https://api.urbandictionary.com/v0/define?${query}`)
    const { list } = await getJSONResponse(dict.body)

    if(!list.leght) {
      return interaction.editReply({
        content: `Error: ${term} unknown`
      })
    }

    const [answer] = list

    const fancy = new EmbedBuilder()
      .setTitle(`__**Urban Dictionary**__`)
      .setDescription('A site with an amazing concept that was great up until 2005-ish. Today, 90% of Urban Dictionary is clogged with bizarre sexual acts that have fucking nothing to do with the original definitions.')
      .setURL(`${answer.permalink}`)
      .setFooter({
        text: `${answer.author}`
      })
      .addFields({
        name: `**${term.toUpperCase()}**`,
        value: `
        \`\`\`${answer.definition}\`\`\`
        `,
        inline: true
      })
      .addFields({
        name: `**EXAMPLE**`,
        value: `
        \`\`\`${answer.example}\`\`\`
        `,
        inline: true
      })

    interaction.editReply({
      embeds: [fancy]
    })
  }
}