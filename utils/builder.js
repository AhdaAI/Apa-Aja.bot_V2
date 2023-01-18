const {
  StringSelectMenuBuilder,
  ActionRowBuilder,
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
} = require("discord.js");

class builder {
  constructor(customId) {
    this.id = customId;
  }

  selectMenu(option = Map, placeHolder = String) {
    /**
     * option = [
     *  {
     *    label: String,
     *    description: String,
     *    value: String
     *  }
     * ]
     */
    return new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(this.id)
        .setPlaceholder(placeHolder)
        .addOptions(option)
    );
  }

  modal(title, data = { base, style: TextInputStyle }) {
    console.log(data);
    const action = [];
    action.push(
      new TextInputBuilder()
        .setCustomId(data.base.id)
        .setLabel(data.base.name)
        .setStyle(data.style)
    );
    return new ModalBuilder()
      .setCustomId(this.id)
      .setTitle(title)
      .components(action);
  }
}

module.exports = builder;
