// Command handlers for Discord bot messages
const { getRandomLeetCodeProblem } = require('./services/leetcode')
const { sendProblemToChannel, sendErrorMessage } = require('./services/message')

/**
 * Command handler for the !leetcode command
 */
async function handleLeetCodeCommand(message) {
  message.channel.send('Fetching a random LeetCode problem...')

  try {
    const problem = await getRandomLeetCodeProblem()
    await sendProblemToChannel(message.channel.id, problem)
  } catch (error) {
    console.error('Error handling leetcode command:', error)
    await sendErrorMessage(message.channel.id)
  }
}

/**
 * Command handler for the !help command
 */
function handleHelpCommand(message) {
  message.channel.send(
    '**LeetCode Bot Commands:**\n' +
      '`!help` - Display help information\n\n' +
      '`!leetcode` - Get a random LeetCode problem\n' +
      '`!leaderboard` - Display the leaderboard (coming soon!)\n' +
      'The bot automatically posts a problem every Friday at 5PM and pings the "LC Friday Enjoyer" role.'
  )
}

/**
 * Command handler for the !leaderboard command
 */
function handleLeaderboardCommand(message) {
  // TODO: Implement leaderboard display
  message.channel.send('Leaderboard feature is coming soon.')
}

/**
 * Registers all command handlers with the client
 * @param {Object} client - Discord client
 */
function registerCommandHandlers(client) {
  client.on('messageCreate', async (message) => {
    // Ignore messages from bots
    if (message.author.bot) return

    // Handle commands
    if (message.content === '!leetcode') {
      await handleLeetCodeCommand(message)
    } else if (message.content === '!help') {
      handleHelpCommand(message)
    } else if (message.content === '!leaderboard') {
      handleLeaderboardCommand(message)
    }
  })

  console.log('Command handlers registered')
}

module.exports = {
  registerCommandHandlers
}
