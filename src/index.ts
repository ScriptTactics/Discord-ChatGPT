import { Client, Collection } from 'discord.js';
import * as env from 'dotenv';
import * as fs from 'fs';
import { Configuration } from 'openai';
import { OpenAIApi } from 'openai/dist/api';
import deployCommand from './deploy-command';
import { ImportCommand } from './models/ImportCommand';

env.config();

deployCommand.deploy();

const commands = new Collection<string, ImportCommand>();
const files = fs.readdirSync('dist/commands').filter(file => file.endsWith('.js'));
for (const file of files) {
    const command = require(`./commands/${file}`) as ImportCommand;
    commands.set(command.data.name, command);

}

const client = new Client({
    intents: [],
});
const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_TOKEN,
});
export const openai = new OpenAIApi(configuration);

client.once('ready', async () => {
    console.log('ready');
});
client.once('shardReconnecting', (id) => {
    console.log(`Shard with ID ${id} reconnected`);
});

client.once('shardDisconnect', (event, shardID) => {
    console.log(`Disconnected from event ${event} with ID ${shardID}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const cmd = commands.get(interaction.commandName);
    if (!cmd) return;
    try {
        await cmd.execute(interaction);
    } catch (error) {
        console.error(error);
    }
});

client.login(process.env.DISCORD_TOKEN);
