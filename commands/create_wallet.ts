/// <reference lib="deno.unstable" />
import { CommandInteraction } from "@djs";

export const CreateWallet = {
  title: "create_wallet",
  description: "ウォレットを作成する",
  handler: async (interaction: CommandInteraction) => {
    const kv = await Deno.openKv();

    try {
      if ((await kv.get(["wallet", interaction.user.id])).value !== null) {
        await interaction.reply(
          "[WARN] このユーザーは既にウォレットを作成しています。",
        );
        return;
      }

      await kv.set(["wallet", interaction.user.id], {
        balance: 50,
        id: interaction.user.id,
        created_at: new Date().getTime(),
      });
      await interaction.reply(
        `[SUCCESS] <@${interaction.user.id}> のウォレットを作成しました。 \n 残金: 50人民元 `,
      );
    } catch (_error) {
      await interaction.reply("[ERROR] 作成に失敗しました。");
    }
  },
  tags: ["銀行コマンド"],
};