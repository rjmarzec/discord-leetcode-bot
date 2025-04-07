const { getRandomUnsolvedProblem } = require('../services/leetcode')
const {
  sendProblemToChannel,
  sendErrorMessage
} = require('../services/message')
const { addProblem } = require('../services/supabase')

/**
 * Command handler for the !leetcode command
 */
async function handleProblemCommand(message) {
  message.channel.send('Fetching a random LeetCode problem...')

  try {
    // Get random problem from leetcode
    const problem = await getRandomUnsolvedProblem()

    // Store problem data
    await addProblem(
      problem.frontendQuestionId,
      problem.title,
      problem.difficulty,
      `https://leetcode.com/problems/${problem.titleSlug}`
    )

    // Send problem to discord channel
    await sendProblemToChannel(message.channel.id, problem)
  } catch (error) {
    console.error('Error handling problem command:', error)
    await sendErrorMessage(message.channel.id)
  }
}

module.exports = {
  handleProblemCommand
}
