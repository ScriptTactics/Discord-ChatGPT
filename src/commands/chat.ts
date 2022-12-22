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
    },
} as ImportCommand