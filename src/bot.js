// Discord client configuration
const { Client, GatewayIntentBits } = require('discord.js');

// Create a new Discord client with required intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

module.exports = { client };