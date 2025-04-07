// commands/leaderboard.js
const { EmbedBuilder } = require('discord.js')
const supabaseService = require('../services/supabase')
const { COLORS } = require('../config')

/**
 * Generate medal emoji based on position
 * @param {number} position - Position in leaderboard
 * @returns {string} - Medal emoji
 */
function getMedal(position) {
  switch (position) {
    case 0:
      return '🥇'
    case 1:
      return '🥈'
    case 2:
      return '🥉'
    default:
      return `${position + 1}.`
  }
}

/**
 * Format difficulty counts for display
 * @param {Object} user - User object with difficulty counts
 * @returns {string} - Formatted string
 */
function formatDifficultyCounts(user) {
  return `🟢 ${user.easysolved || 0} | 🟡 ${user.mediumsolved || 0} | 🔴 ${user.hardsolved || 0}`
}

/**
 * Handle leaderboard command
 * @param {Object} message - Discord message
 * @param {Array} args - Command arguments
 */
async function handleLeaderboardCommand(message, args) {
  try {
    // Check if user wants personal stats
    if (
      args.length > 0 &&
      ['me', 'my', 'mine', 'personal'].includes(args[0].toLowerCase())
    ) {
      await handlePersonalStats(message)
      return
    }

    // Get server leaderboard
    const leaderboard = await supabaseService.getLeaderboard(10)

    if (!leaderboard || leaderboard.length === 0) {
      message.reply(
        'No one has solved any problems yet! Be the first by reacting with ✅ to a LeetCode problem.'
      )
      return
    }

    const embed = new EmbedBuilder()
      .setTitle('🏆 LeetCode Leaderboard 🏆')
      .setColor(COLORS.DEFAULT)
      .setDescription(`Top problem solvers in ${message.guild.name}`)
      .setTimestamp()

    // Add leaderboard entries
    const leaderboardText = leaderboard
      .map((user, index) => {
        return `${getMedal(index)} **${user.username}**: ${user.totalsolved} solved\n${formatDifficultyCounts(user)}`
      })
      .join('\n\n')

    embed.addFields({ name: 'Rankings', value: leaderboardText })
    embed.setFooter({
      text: 'React with ✅ to problems to get on the leaderboard!'
    })

    message.channel.send({ embeds: [embed] })
  } catch (error) {
    console.error('Error displaying leaderboard:', error)
    message.reply('Sorry, there was an error retrieving the leaderboard.')
  }
}

/**
 * Handle personal stats command
 * @param {Object} message - Discord message
 */
async function handlePersonalStats(message) {
  try {
    const userid = message.author.id
    const stats = await supabaseService.getUserStats(userid)

    if (!stats || stats.totalsolved === 0) {
      message.reply(
        "You haven't solved any problems yet! React with ✅ to mark problems as solved."
      )
      return
    }

    // Get recently solved problems
    const recentSolved = await supabaseService.getRecentlySolved(5)
    const userRecentSolved = recentSolved
      .filter((item) => item.users && item.users.userid === userid)
      .slice(0, 3)

    const embed = new EmbedBuilder()
      .setTitle(`${message.author.username}'s LeetCode Stats`)
      .setColor(COLORS.DEFAULT)
      .setThumbnail(message.author.displayAvatarURL())
      .addFields(
        {
          name: 'Total Problems Solved',
          value: `${stats.totalsolved}`,
          inline: true
        },
        {
          name: 'Breakdown by Difficulty',
          value: formatDifficultyCounts(stats),
          inline: true
        },
        {
          name: 'Last Active',
          value: new Date(stats.lastactive).toLocaleDateString(),
          inline: true
        }
      )
      .setTimestamp()

    // Add recent problems if available
    if (userRecentSolved.length > 0) {
      const recentText = userRecentSolved
        .map((item) => {
          const problem = item.problems
          const difficultyEmoji =
            problem.difficulty.toLowerCase() === 'easy'
              ? '🟢'
              : problem.difficulty.toLowerCase() === 'medium'
                ? '🟡'
                : '🔴'

          return `${difficultyEmoji} [${problem.title}](${problem.url})`
        })
        .join('\n')

      embed.addFields({ name: 'Recently Solved', value: recentText })
    }

    message.channel.send({ embeds: [embed] })
  } catch (error) {
    console.error('Error displaying personal stats:', error)
    message.reply('Sorry, there was an error retrieving your stats.')
  }
}

module.exports = {
  handleLeaderboardCommand
}
