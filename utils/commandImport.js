const { readdirSync } = require("fs");
const { join } = require("path");

const events = [];
const commands = {
  globalCommand: [],
  localCommand: [],
  allCommand: [],
};

const sourcePath = join(__dirname, "../src");
const eventPath = join(__dirname, "../events");
const commandFiles = readdirSync(sourcePath).filter((file) =>
  file.endsWith(".js")
);
readdirSync(eventPath)
  .filter((file) => file.endsWith(".js"))
  .map((fil) => events.push(fil));

for (const file of commandFiles) {
  const com = require(`../src/${file}`);
  if (!com.execute) {
    console.log(`[-] ${file}`);
    continue;
  }

  commands.allCommand.push(com);
  if (com.test) {
    commands.localCommand.push(com.data.toJSON());
  } else {
    commands.globalCommand.push(com.data.toJSON());
  }
}

const commandsTable = [
  {
    Globals: commands.globalCommand.map((com) => com.name),
    Locals: commands.localCommand.map((com) => com.name),
    Event: events,
  },
];

console.table(commandsTable);

module.exports = {
  command: commands,
  Event: events,
};
