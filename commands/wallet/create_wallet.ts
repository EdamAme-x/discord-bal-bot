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
          "**[WARN]** このユーザーは既にウォレットを作成しています。",
        );
        return;
      }

      await kv.set(["wallet", interaction.user.id], {
        balance: 20,
        id: interaction.user.id,
        updated_at: Date.now(),
        username: interaction.user.username,
      });
      await interaction.reply(
        `**[SUCCESS]** <@${interaction.user.id}> のウォレットを作成しました。 \n残金: 20人民元 `,
      );
    } catch (_error) {
      await interaction.reply("**[ERROR]** 作成に失敗しました。");
    }
  },
  tags: ["銀行コマンド"],
};
