const { ActionRowBuilder, SelectMenuBuilder, ModalBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, SelectMenuOptionBuilder, SelectMenuComponent } = require('discord.js')

class dropDown {
    constructor(customId = SelectMenuBuilder.prototype.setCustomId) {
        this.customId = customId
    }

    build(placeHolder = SelectMenuComponent.prototype.placeholder, option = SelectMenuComponent.prototype.options) {
        return new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId(this.customId)
                    .setPlaceholder(placeHolder)
                    .addOptions(option)
            )
    }
}

class modal {
    constructor(customId = ModalBuilder.prototype.setCustomId) {
        this.customId = customId
    }

    build(title = ModalBuilder.prototype.setTitle, map = ModalBuilder.prototype.components) {
        const modal = new ModalBuilder()
            .setTitle(title)
            .setCustomId(this.customId)
        
        map.forEach(m => {
            modal.addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId(m.id.toLowerCase())
                        .setLabel(m.label)
                        .setStyle(m.style)
                )
            )
        })

        return modal
    }
}


module.exports = {
    dropDown,
    modal
}