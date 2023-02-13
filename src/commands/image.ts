import { EmbedBuilder } from '@discordjs/builders';
import { SlashCommandBuilder } from 'discord.js';
import { openai } from '..';
import { ImportCommand } from '../models/ImportCommand';

const commandName = 'image';
export = {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription('Input your image description')
        .addStringOption(option =>
            option.setName(commandName)
                .setDescription('Ask for a generated image')
                .setRequired(true),
        ),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        try {
            const response = openai.createImage({
                prompt: interaction.options.getString(commandName),
                n: 1,
                size: '1024x1024',
            });
            const imgUrl = (await response).data.data[0].url;

            const embedBuilder = new EmbedBuilder();
            embedBuilder.setImage(imgUrl);
            await interaction.followUp({ embeds: [embedBuilder], ephemeral: true });
            interaction.followUp({ ephemeral: true, content: 'Prompt: ' + interaction.options.getString(commandName) });
        } catch (error) {
            console.error(error);

        }
    },

} as ImportCommand;