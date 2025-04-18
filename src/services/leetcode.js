// LeetCode API service for fetching problems
const axios = require('axios')
const { LEETCODE_API } = require('../config')
const { getAllProblems } = require('./supabase')

/**
 * Fetches a random free problem from LeetCode using GraphQL API
 * @returns {Promise<Object>} A random LeetCode problem object
 */
async function getRandomLeetCodeProblem() {
  try {
    // GraphQL query for fetching problem list
    const query = `
      query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
        problemsetQuestionList: questionList(
          categorySlug: $categorySlug
          limit: $limit
          skip: $skip
          filters: $filters
        ) {
          total: totalNum
          questions: data {
            acRate
            difficulty
            freqBar
            frontendQuestionId: questionFrontendId
            isFavor
            paidOnly: isPaidOnly
            status
            title
            titleSlug
            topicTags {
              name
              id
              slug
            }
            hasSolution
            hasVideoSolution
          }
        }
      }
    `

    // Headers for the request
    const headers = {
      'Content-Type': 'application/json'
    }

    // Make API request
    const response = await axios.post(
      LEETCODE_API,
      {
        query,
        variables: {
          categorySlug: '',
          skip: 0,
          limit: 100,
          filters: {}
        }
      },
      { headers }
    )

    // Validate response
    if (!response.data?.data?.problemsetQuestionList) {
      console.log('Unexpected response structure:', response.data)
      throw new Error('Invalid response structure')
    }

    // Extract questions from response
    const questions = response.data.data.problemsetQuestionList.questions
    if (!questions || questions.length === 0) {
      throw new Error('No questions returned')
    }

    // Filter out paid-only problems
    const freeQuestions = questions.filter((q) => !q.paidOnly)
    if (freeQuestions.length === 0) {
      throw new Error('No free questions available')
    }

    // Select a random problem
    const randomIndex = Math.floor(Math.random() * freeQuestions.length)
    return freeQuestions[randomIndex]
  } catch (error) {
    console.error('Error fetching LeetCode problem:', error)
    console.error('Error response:', error.response?.data)
    throw error
  }
}

/**
 * Fetches a random unsolved free problem from LeetCode
 * @returns {Promise<Object>} A random unsolved LeetCode problem
 */
async function getRandomUnsolvedProblem() {
  try {
    // Get all solved problem IDs from the database
    const solvedProblems = await getAllProblems()
    const solvedProblemIds = new Set(solvedProblems.map((p) => p.problemid))

    // Try up to 5 times to find an unsolved problem
    for (let attempt = 0; attempt < 5; attempt++) {
      const problem = await getRandomLeetCodeProblem()

      // Check if this problem has been solved already
      if (!solvedProblemIds.has(problem.frontendQuestionId)) {
        console.log('found a problem: ', problem)
        return problem
      }

      console.log(
        `Problem ${problem.frontendQuestionId} ${problem.titleSlug} already solved, trying again...`
      )
    }

    throw new Error(
      'Could not find an unsolved problem after multiple attempts'
    )
  } catch (error) {
    console.error('Error fetching unsolved LeetCode problem:', error)
    throw error
  }
}

module.exports = {
  getRandomUnsolvedProblem
}
