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
    return new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(this.id)
        .setPlaceholder(placeHolder)
        .addOptions(option)
    );
  }

  modal(title, data = [{ id: String, label: String, style: TextInputStyle }]) {
    const action = data.map((act) => {
      return new TextInputBuilder()
        .setCustomId(act.id)
        .setLabel(act.label)
        .setStyle(act.style);
    });
    return new ModalBuilder()
      .setCustomId(this.id)
      .setTitle(title)
      .addComponents(action);
  }
}

module.exports = {
  builder,
};
