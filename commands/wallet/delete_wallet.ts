/// <reference lib="deno.unstable" />
import { CommandInteraction } from "@djs";

export const DeleteWallet = {
  title: "delete_wallet",
  description: "ウォレットを削除する",
  handler: async (interaction: CommandInteraction) => {
    const kv = await Deno.openKv();

    try {
      if ((await kv.get(["wallet", interaction.user.id])).value == null) {
        await interaction.reply(
          "**[WARN]** このユーザーは既にウォレットを削除しています。",
        );
        return;
      }

      await kv.delete(["wallet", interaction.user.id]);
      await interaction.reply(
        `**[SUCCESS]** <@${interaction.user.id}> のウォレットを削除しました。`,
      );
    } catch (_error) {
      await interaction.reply("**[ERROR]** 削除に失敗しました。");
    }
  },
  tags: ["銀行コマンド"],
};
