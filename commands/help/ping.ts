import { CommandInteraction } from "@djs";

export const Ping = {
  title: "ping",
  description: "応答速度を測定",
  handler: async (interaction: CommandInteraction) => {
    const first = performance.now();
    await interaction.reply("[測定中...]");
    const second = performance.now();
    await interaction.editReply(
      `応答速度: ${
        Math.floor((second - first) * 1000) / 2000
      }ms\nCreated by @amex2189`,
    );
  },
  tags: ["テストコマンド"],
};
