const { ActionRowBuilder, SelectMenuBuilder } = require("@discordjs/builders");

class builder {
  constructor(customId) {
    this.id = customId;
  }

  selectMenu(option = Map, placeHolder = String) {
    return new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId(this.id)
        .setPlaceholder(placeHolder)
        .addOptions(option)
    );
  }
}

module.exports = {
  builder,
};
