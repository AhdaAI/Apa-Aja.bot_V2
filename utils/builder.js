const { ActionRowBuilder, SelectMenuBuilder, ModalBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle } = require('discord.js')

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

    modal(title = String, map = Array) {
        const modal = new ModalBuilder()
            .setCustomId(this.customId)
            .setTitle(title)

        let num = 1
        map.forEach(m => {
            modal.addComponents(new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId(m.id.toLowerCase())
                    .setLabel(m.label)
                    .setStyle(m.style)
            ))
        })
        return modal
    }
}