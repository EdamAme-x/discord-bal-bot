import { CommandInteraction, EmbedBuilder } from "@djs";
import { commands } from "../main.ts";

export const Help = {
  title: "help",
  description: "ヘルプ表示",
  handler: async (interaction: CommandInteraction) => {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle("[HELP]")
          .setURL("https://twitter.com/amex2189")
          .setDescription(`ヘルプ一覧`)
          .addFields(
            ...commands.map((command) => {
              return {
                name: `${command.tags.join(",")} : /${command.title}`,
                value: command.description,
              };
            }),
          )
          .setTimestamp(),
      ],
    });
  },
  tags: ["テストコマンド"],
};
