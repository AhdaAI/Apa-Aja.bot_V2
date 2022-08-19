const { ActionRowBuilder, SelectMenuBuilder, ModalBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = class builder {
    constructor(customId = String) {
        this.customId = customId
    }

    dropDown(placeHolder = String, option) {
        return new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId(this.customId)
                    .setPlaceholder(placeHolder)
                    .addOptions(option)
            )
    }

    button(placeHolder = String, label = String, style = ButtonStyle) {
        return new ButtonBuilder()
            .setCustomId(this.customId)
            .setLabel(label)
            .setStyle(style)
    }
}