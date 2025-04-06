// Reaction handlers for Discord bot messages

/**
 * Handles reaction additions
 * @param {Object} reaction - The message reaction object
 * @param {Object} user - The user who reacted
 */
async function handleReactionAdd(reaction, user) {
  console.log('Reaction event triggered!')

  // Ignore non-'✅' reactions
  if (reaction.emoji.name !== '✅') {
    return
  }

  // Fetch partials if needed
  if (reaction.partial) {
    await reaction.fetch()
  }
  if (reaction.message.partial) {
    await reaction.message.fetch()
  }

  const message = reaction.message

  // Check if the message author is the leetcode_bot
  if (message.author.username !== 'leetcode_bot') {
    console.log('Reaction is not on a LeetCode bot message. Ignoring.')
    return
  }

  // Access the embeds
  const embeds = message.embeds
  if (embeds.length > 0) {
    const embed = embeds[0]
    console.log('Embed title:', embed.title)
    console.log('Embed URL:', embed.url)
    console.log('Embed description:', embed.description)
    console.log('Embed footer:', embed.footer?.text)
  } else {
    console.log('No embeds found in this message.')
  }

  console.log('reacted by user:', user)

  // TODO: Add leaderboard logic here
}

/**
 * Registers all reaction handlers with the client
 * @param {Object} client - Discord client
 */
function registerReactionHandlers(client) {
  client.on('messageReactionAdd', async (reaction, user) => {
    // Ignore reactions from bots
    if (user.bot) return

    handleReactionAdd(reaction, user)
  })
}

module.exports = {
  registerReactionHandlers
}
