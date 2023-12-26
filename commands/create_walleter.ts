/// <reference lib="deno.unstable" />
import { CommandInteraction } from "@djs";

export const CreateWallet = {
  title: "create_wallet",
  description: "他人のウォレットを作成する",
  type: 1,
  options: [
    {
      name: "user",
      type: 6,
      required: true,
      description: "作成したいユーザー",
    }
  ],
  handler: async (interaction: CommandInteraction) => {
    const kv = await Deno.openKv();

    try {
      if ((await kv.get(["wallet", interaction.options.data[0].user?.id])).value !== null) {
        await interaction.reply(
          "[WARN] このユーザーは既にウォレットを作成しています。",
        );
        return;
      }

      await kv.set(["wallet", interaction.options.data[0].user?.id], {
        balance: 50,
        id: interaction.options.data[0].user?.id,
        created_at: new Date().getTime(),
      });
      await interaction.reply(
        `[SUCCESS] <@${interaction.options.data[0].user?.id}> のウォレットを作成しました。 \n 残金: 50人民元 `,
      );
    } catch (_error) {
      await interaction.reply("[ERROR] 作成に失敗しました。");
    }
  },
  tags: ["銀行コマンド"],
};
