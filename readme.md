# Discord-ChatGPT
This Discord Bot will allow you to interface with the ChatGPT AI.


## Installation

1. Make sure you have [git](https://git-scm.com/) installed on your computer **OR** download the [ZIP](https://github.com/ScriptTactics/Discord-ChatGPT/archive/refs/heads/master.zip) of the project.
2. Extract the contents of the ZIP **OR** navigate inside the cloned repository.
3. Once inside the folder create a file named `.env` in the root of the project. The file will need the following:
```.env
DISCORD_TOKEN=
CHID=
CLIENTID=
GUILDID=
OPEN_AI_TOKEN=
```
There is an example .env file in the repo named `ex.env`

You will need to create a Bot on discord and get the Token to place in this file. You will also need the Channel ID of the channel you want the bot to post to, you will need the Bot's client ID and the Guild ID (Server Id).

You will also need to create an account on [openai.com](https://openai.com/) and create an API key to utilize with the bot.

Once you have all of these you will have to add the bot to your server.

## Adding Bot to Server

This is the URL you will use to add the bot to your server. You will have to change 2 things in this url.

1. `client_id=` - set this to your BOT's Client ID
2. `permissions=` - this will have to be set to to correct numeric value to allow your bot to send messages, create slash commands, and read messages.

Use [this](https://discordapi.com/permissions.html) tool to help you create the permission integer.

`https://discord.com/api/oauth2/authorize?client_id=123456789012345678&permissions=0&scope=bot%20applications.commands
`


## Running the Bot

Once you added the bot to your server and you setup the appropriate tokens and ID's in your `.env` file you are ready to run the bot.

1. Make sure you have [NodeJs](https://nodejs.org/en/) installed: `Version: 16.13.0LTS` or greater

 This should also install NPM as the package manager so you can install all the other dependencies.

 After NodeJS and NPM is installed, open a terminal in the root directory of the project and type:

 ```
 npm install
 ```
 once that finishes you can proceed to run the bot by typing:

 ```
 npm run start
 ```

 If this works you should see your bot come online in your discord server.

## Commands

This bot has 2 commands
- `/chat` - Has 1 argument.
  - `chat` - Type in your prompt to the AI. It can accept up to 2048 character.
- `/image` - Has 1 arguement
  - `image` - Type your image description to the AI. It can accept up to 2048 characters.
  The AI will then respond with an image of your description. Sized 1024x1024




