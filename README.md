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
# Discord Bot Configuration
DISCORD_TOKEN=your_discord_bot_token_here
CHANNEL_ID=your_discord_channel_id_here
ROLE_NAME=LC Friday Enjoyer (or your own role name to ping)

# Supabase Configuration
SUPABASE_URL=https://your-project-url.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Commands

- `!help` - Display help information
- `!problem` - Get a random LeetCode problem
- `!leaderboard` - Show the server's leaderboard
- `!leaderboard me` - Show your personal stats

## Project Structure

```
├── index.js           # Entry point
├── bot.js             # Discord client setup
├── config.js          # Configuration settings
├── reactions.js       # Reaction handlers
├── commands/
│   ├── commands.js    # Command handlers
│   ├── help.js        # Help command handler
|   |── leaderboard.js # Leaderboard command handler
|   └── problem.js     # Problem command handler
├── services/
│   ├── leetcode.js    # LeetCode API service
│   ├── message.js     # Message sending/formatting service
│   └── scheduler.js   # Cron job scheduler
└── package.json       # Project dependencies
```

## Database Schema (Supabase)

The following tables are used to track users, problems, and solved problems in the application.

### Users Table

| Column       | Type                                                 | Description                       |
| ------------ | ---------------------------------------------------- | --------------------------------- |
| userid       | `TEXT PRIMARY KEY`                                   | Unique identifier for the user    |
| username     | `TEXT NOT NULL`                                      | Username of the user              |
| totalsolved  | `INTEGER DEFAULT 0`                                  | Total problems solved by the user |
| easysolved   | `INTEGER DEFAULT 0`                                  | Easy problems solved              |
| mediumsolved | `INTEGER DEFAULT 0`                                  | Medium problems solved            |
| hardsolved   | `INTEGER DEFAULT 0`                                  | Hard problems solved              |
| lastactive   | `TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP` | Last active timestamp             |

### Problems Table

| Column     | Type                                                 | Description                           |
| ---------- | ---------------------------------------------------- | ------------------------------------- |
| problemid  | `TEXT PRIMARY KEY`                                   | Unique identifier for the problem     |
| title      | `TEXT NOT NULL`                                      | Problem title                         |
| difficulty | `TEXT NOT NULL`                                      | Difficulty level (Easy, Medium, Hard) |
| url        | `TEXT NOT NULL`                                      | URL to the problem                    |
| postedat   | `TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP` | Posted timestamp                      |

### Solved Problems Table

| Column    | Type                                                 | Description                                           |
| --------- | ---------------------------------------------------- | ----------------------------------------------------- |
| id        | `SERIAL PRIMARY KEY`                                 | Unique identifier for each entry                      |
| userid    | `TEXT NOT NULL REFERENCES users(userid)`             | References `users(userid)`                            |
| problemid | `TEXT NOT NULL REFERENCES problems(problemid)`       | References `problems(problemid)`                      |
| solvedat  | `TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP` | Solved timestamp                                      |
| Unique    | `(userid, problemid)`                                | Ensures each user marks a problem as solved only once |

### Indexes

To improve performance of queries:

```sql
CREATE INDEX idx_solved_userid ON solved(userid);
CREATE INDEX idx_solved_problemid ON solved(problemid);
CREATE INDEX idx_solved_solvedat ON solved(solvedat);
```

## Development

Run the bot with auto-restart on file changes:

```
nodemon src/index.js
```
