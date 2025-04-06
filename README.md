# Discord Leetcode Bot

A Discord bot that sends random LeetCode problem links every Friday at 5PM and provides on-demand problems with the `!leetcode` command.

## Features

- 📅 Automatically posts a random LeetCode problem every Friday at 5PM
- 🎯 On-demand problem fetching with `!leetcode` command
- 🎨 Cool embeds with problem details and difficulty color coding
- 🏷️ Role pinging for notifications
- 💰 Filters out premium-only problems

## TODO

- [ ] Based on message reaction, keep track of leaderboard
- [ ] Implement problem history to avoid repetition
- [ ] Command to display the leaderboard: `!leaderboard`
- [ ] Host this somewhere (rasberry pi?)


## Setup Instructions

1. Clone this repository
2. Install dependencies with `npm install`
3. Copy `.env.example` to `.env` and fill in your Discord bot token and channel ID
4. Start the bot with `npm start`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DISCORD_TOKEN=your_discord_bot_token_here
CHANNEL_ID=your_discord_channel_id_here
ROLE_NAME=LC Friday Enjoyer (or your own role name to ping)
```

## Commands

- `!leetcode` - Get a random LeetCode problem
- `!help` - Display help information

## Project Structure

```
├── index.js           # Entry point
├── bot.js             # Discord client setup
├── config.js          # Configuration settings
├── commands.js        # Command handlers
├── reactions.js       # Reaction handlers
├── services/
│   ├── leetcode.js    # LeetCode API service
│   ├── message.js     # Message sending/formatting service
│   └── scheduler.js   # Cron job scheduler
└── package.json       # Project dependencies
```

## Development

Run the bot with auto-restart on file changes:

```
nodemon src/index.js
```
