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
		await wait(5000);
        try {
            const response = (
                await openai.createCompletion({
                    model: 'text-davinci-003',
                    prompt: interaction.options.getString('chat'),
                    temperature: 0.9,
                    max_tokens: 2048,
                })
            ).data.choices[0].text;
            console.log(interaction.options.getString('chat'));
            if (!response) interaction.reply('Error');
            interaction.editReply(response.slice(0, 1500));
            if (response.length > 1500) {
                let x = 0;
               for (let i = 1500; i < response.length; i += 1500) {
                interaction.followUp(response.slice(x, i));
                x = i;
               }
            }
        } catch (error) {
            console.error(error);

        }
    }
});

client.login(process.env.DISCORD_TOKEN);
