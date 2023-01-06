const { REST, Routes } = require("discord.js");
const { env } = require("process");
const { command, event } = require("./commandImport");
require("dotenv").config();

const { ClientID, GuildID, TOKEN } = env;

const rest = new REST({ version: "10" }).setToken(TOKEN);

var start = async () => {
  const { localCommand, globalCommand } = command;

  const globalData = await rest
    .put(Routes.applicationCommands(ClientID), {
      body: globalCommand,
    })
    .then(() =>
      console.log(
        `[!] Refreshed ${globalCommand.length} globals application (/) commands.`
      )
    )
    .catch((e) => console.log(`[!] ${e}`));

  const localData = await rest
    .put(Routes.applicationGuildCommands(ClientID, GuildID), {
      body: localCommand,
    })
    .then(() =>
      console.log(
        `[!] Refreshed ${localCommand.length} local application (/) commands.`
      )
    )
    .catch((e) => console.log(`[!] ${e}`));
};

module.exports = {
  start,
};
