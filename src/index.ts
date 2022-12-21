import { Client } from 'discord.js';
import * as env from 'dotenv';
import { Configuration } from 'openai';
import { OpenAIApi } from 'openai/dist/api';

env.config();

const wait = require('node:timers/promises').setTimeout;
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

    if (interaction.commandName == 'chat') {
        await interaction.deferReply();
        await wait(50);
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
                interaction.followUp(response);
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
                    interaction.followUp(segment);
                }
            }
            interaction.followUp('Prompt: ' + interaction.options.getString('chat'));
        } catch (error) {
            console.error(error);
        }
    }
});
// /**
//  * @param {string} string that may contain code
//  * @return {string | null} Language name if found
//  */
// function detectCode(string: string): string | null {
//     const languages = [
//         { name: 'JavaScript', syntax: /function|for|class/ },
//         { name: 'Python', syntax: /def|for|class/ },
//         { name: 'C++', syntax: /int|for|class/ },
//     ];

//     for (const language of languages) {
//         const regex = new RegExp(language.syntax);
//         if (regex.test(string)) {
//             return language.name;
//         }
//     }

//     return null;
// }


client.login(process.env.DISCORD_TOKEN);
