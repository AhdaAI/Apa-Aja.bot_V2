const { Client, ActivityType, Collection } = require("discord.js");
const { env } = require("process");
const { command, Event, start } = require("./utils/commandImport");
require("dotenv").config();

const { TOKEN } = env;
const { allCommand } = command;

const client = new Client({
  intents: 131071,
  presence: {
    activities: [{ name: "/", type: ActivityType.Listening }],
  },
});

client.commands = new Collection();

allCommand.forEach((com) => {
  client.commands.set(com.data.name, com);
});
module.exports = { client };

try {
  start();
  for (const even of Event) {
    const eve = require(`./events/${even}`);
    if (eve.once) {
      client.once(eve.name, async (...args) => eve.execute(...args));
    } else {
      client.on(eve.name, async (...args) => eve.execute(...args));
    }
  }
} catch (err) {
  console.log(err);
}

client.login(TOKEN);
