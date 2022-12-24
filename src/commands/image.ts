import { EmbedBuilder } from "@discordjs/builders";
import { SlashCommandBuilder } from "discord.js";
import { openai } from "..";
import { ImportCommand } from "../models/ImportCommand";

export = {
    data: new SlashCommandBuilder()
        .setDescription("Input your image description")
        .addStringOption(option =>
            option.setName('image')
                .setDescription("Ask for a generated image")
                .setRequired(true),
        ),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        try {
            const response = openai.createImage({
                prompt: interaction.options.getString('image'),
                n: 1,
                size: "1024x1024"
            });
            const img_url = (await response).data.data[0].url;

            const embedBuilder = new EmbedBuilder();
            embedBuilder.setImage(img_url);
            await interaction.followUp({embeds: [embedBuilder], ephemeral: true})
        } catch (error) {
            
        }
    }

} as ImportCommand;