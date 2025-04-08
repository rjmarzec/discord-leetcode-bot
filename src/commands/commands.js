// Command handlers for Discord bot messages
const { handleHelpCommand } = require('./help')
const { handleLeaderboardCommand } = require('./leaderboard')
const { handleProblemCommand } = require('./problem')
const { handlePingCommand } = require('./ping')

/**
 * Process commands from messages
 * @param {Object} message - Discord message
 */
async function processCommands(message) {
  const content = message.content.trim()

  // Ignore messages that don't start with the prefix
  if (!content.startsWith('!')) return

  // Parse command and arguments
  const args = content.slice(1).split(/\s+/)
  const command = args.shift().toLowerCase()

  switch (command) {
    case 'problem':
      await handleProblemCommand(message, args)
      break
    case 'leaderboard':
      await handleLeaderboardCommand(message, args)
      break
    case 'help':
      await handleHelpCommand(message)
      break
    case 'ping':
      await handlePingCommand(message)
      break
    default:
      // Ignore unrecognized commands
      break
  }
}

/**
 * Register command handlers with client
 * @param {Object} client - Discord client
 */
function registerCommandHandlers(client) {
  client.on('messageCreate', async (message) => {
    // Ignore messages from bots
    if (message.author.bot) return

    processCommands(message)
  })
}

module.exports = {
  registerCommandHandlers
}
