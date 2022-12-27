import { SlashCommandBuilder } from 'discord.js';
import { openai } from '..';
import { ImportCommand } from '../models/ImportCommand';

export = {
    data: new SlashCommandBuilder()
        .setName('chat')
        .setDescription('Input your prompt here')
        .addStringOption(option =>
            option.setName('chat')
                .setDescription('Chat with ChatGPT bot')
                .setRequired(true),
        ),
    async execute(interaction) {
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
            // const messageLegnth = response.length;

            for await (const segment of splitString(response, 2000)) {
                await interaction.followUp({ ephemeral: true, content: segment });
            }

            interaction.followUp({ ephemeral: true, content: 'Prompt: ' + interaction.options.getString('chat') });
        } catch (error) {
            console.error(error);
        }
    },
} as ImportCommand

/**
 *
 * @param {string} str message
 * @param {number} chunkSize message size
 */
function* splitString(str: string, chunkSize: number) {
    let i = 0;
    while (i < str.length) {
        yield str.slice(i, i + chunkSize);
        i += chunkSize;
    }
}