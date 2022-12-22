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
    if (interaction.commandName == cmd.data.name) {
        await interaction.deferReply({ ephemeral: true });
        try {
            const response = (
                await openai.createCompletion({
                    model: 'text-davinci-003',
                    prompt: interaction.options.getString('chat'),
                    temperature: 0.9,
                    max_tokens: 2048,
                })
            ).data.choices[0].text;
            if (!response) interaction.reply('Error');
            const messageLegnth = response.length;
            if (messageLegnth <= 2000) {
                interaction.followUp({ ephemeral: true, content: response });
            } else {
                const segments: string[] = [];
                let currentSegment = '';
                for (let i = 0; i < messageLegnth; i++) {
                    currentSegment += response[i];
                    if (currentSegment.length === 2000) {
                        segments.push(currentSegment);
                        currentSegment = '';
                    }
                }
                if (currentSegment) {
                    segments.push(currentSegment);
                }
                for (const segment of segments) {
                    interaction.followUp({ ephemeral: true, content: segment });
                }
            }
            interaction.followUp({ ephemeral: true, content: 'Prompt: ' + interaction.options.getString('chat') });
        } catch (error) {
            console.error(error);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
