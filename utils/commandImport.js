const { REST, Routes } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");
require("dotenv").config();
const { env } = require("process");

const events = [];
const commands = {
  globalCommand: [],
  localCommand: [],
  allCommand: [],
};

const eventPath = join(__dirname, "../events");
readdirSync(eventPath)
  .filter((file) => file.endsWith(".js"))
  .map((fil) => events.push(fil));

const sourcePath = join(__dirname, "../src");
const testPath = join(__dirname, "../src/test");
const globalFiles = readdirSync(sourcePath).filter((file) =>
  file.endsWith(".js")
);
const localFiles = readdirSync(testPath).filter((file) => file.endsWith(".js"));

for (file of globalFiles) {
  const com = require(sourcePath + "/" + file);
  if (!com.execute) {
    console.log(`[-] ${file}`);
    continue;
  }
  commands.allCommand.push(com);
  commands.globalCommand.push(com.data.toJSON());
}

for (file of localFiles) {
  const com = require(sourcePath + "/test/" + file);
  if (!com.execute) {
    console.log(`[-] ${file}`);
    continue;
  }
  commands.allCommand.push(com);
  commands.localCommand.push(com.data.toJSON());
}

const commandsTable = [
  {
    Globals: `${commands.globalCommand.length} Commands.`,
    Locals: `${commands.localCommand.length} Commands.`,
    Event: `${events.length} Events.`,
  },
];

console.table(commandsTable);

async function start() {
  const { TOKEN, ClientID, GuildID } = env;
  const rest = new REST({ version: "10" }).setToken(TOKEN);

  //Local commands deploy
  const localCom = await rest
    .put(Routes.applicationGuildCommands(ClientID, GuildID), {
      body: commands.localCommand,
    })
    .then(() =>
      console.log(
        `[!] Refreshed ${commands.localCommand.length} locals application (/) commands.`
      )
    )
    .catch((e) => console.log(e));

  //Global commands deploy
  const globalCom = await rest
    .put(Routes.applicationCommands(ClientID), { body: commands.globalCommand })
    .then(() =>
      console.log(
        `[!] Refreshed ${commands.globalCommand.length} globals application (/) commands.`
      )
    )
    .catch((e) => console.log(e));
}

module.exports = {
  command: commands,
  Event: events,
  start,
};
