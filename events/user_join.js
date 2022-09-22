const { EmbedBuilder, GuildMember } = require('discord.js')
const { users, channel } = require('../utils/conf.json')

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    /**
     * 
     * @param {GuildMember} member 
     */
    execute: async (member) => {
        const creds = await member.guild.members.fetch(users.credits)
        const server = await member.guild
        const welcome_channel = await member.guild.channels.fetch(channel.welcome)
        const owner = await member.guild.fetchOwner()
        const djRole = await member.guild.roles.fetch(users.dj_role)

        const fancy = new EmbedBuilder()
            .setTitle('WELCOME RANDOM PERSON FROM EARTH')
            .setDescription('*Welcome to our tiny server, enjoy your stay!*')
            .setThumbnail(server.iconURL())

        const field = []
        field.push({
            name: `__USER__`,
            value: `
                > Mention: ${await member.user}
                > Username: ${await member.user.username}
                > Tag: ${await member.user.tag}
            `,
            inline: false
        })
        field.push({
            name: `__INFORMATION__`,
            value: `
                > Role: ${await member.guild.channels.fetch(channel.role)}
                > Free Games: ${await member.guild.channels.fetch(channel.freebie)}
            `,
            inline: true
        })
        field.push({
            name: `__SERVER INFORMATION__`,
            value:`
                > Owner: ${owner.user}
                > Member: ${server.memberCount}
                > Server Picture: ${creds}
            `,
            inline: true
        })

        fancy.addFields(field)

        await member.roles.add(djRole).catch(console.error)

        await welcome_channel.send({
            embeds: [fancy]
        })
    }
}