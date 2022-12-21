import { SlashCommandBuilder } from 'discord.js';

export = {
    data: new SlashCommandBuilder()
        .setName('chat')
        .setDescription('Input your prompt here')
        .addStringOption(option =>
            option.setName('chat')
                .setDescription('Chat with ChatGPT bot')
                .setRequired(true),
        ),
}