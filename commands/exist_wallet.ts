import { CommandInteraction } from "@djs";
import "https://deno.land/std@0.191.0/dotenv/load.ts";

export const ExistWallet = {
  title: "exist_wallet",
  description: "ウォレットを持っているか",
  type: 1,
  options: [
    {
      name: "user",
      type: 6,
      required: true,
      description: "ウォレットを持っているかを確認したいユーザー",
    },
  ],
  handler: async (interaction: CommandInteraction) => {
    const kv = await Deno.openKv();

    if (
      !((await kv.get(["wallet", interaction.options.data[0].user?.id])).value)
    ) {
      await interaction.reply(
        "[INFO] このユーザーはウォレットを作成していません。",
      );
      return;
    } else {
      await interaction.reply(
        `[INFO] このユーザーはウォレットを作成しています。
残高: ${
          (await kv.get(["wallet", interaction.options.data[0].user?.id])).value
            ?.balance ?? 0
        } 人民元
`,
      );
    }
  },
  tags: ["管理コマンド"],
};
