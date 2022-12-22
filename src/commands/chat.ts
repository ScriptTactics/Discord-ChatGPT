import { SlashCommandBuilder } from 'discord.js';
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
} as ImportCommand