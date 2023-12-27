import { CommandInteraction } from "@djs";
import "https://deno.land/std@0.191.0/dotenv/load.ts";

export const MyWallet = {
  title: "my_wallet",
  description: "自分のウォレット確認",
  handler: async (interaction: CommandInteraction) => {
    const kv = await Deno.openKv();

    if (
      !((await kv.get(["wallet", interaction.user?.id])).value)
    ) {
      await interaction.reply(
        "[INFO] 貴方はウォレットを作成していません。",
      );
      return;
    } else {
      const value = (await kv.get(["wallet", interaction.user.id])).value;
      await interaction.reply(
        `**[MYWALLET]** 
残高: ${value?.balance ?? 0} 人民元
最終更新: ${new Date(value?.updated_at).toLocaleString("ja-JP")}
`,
      );
    }
  },
  tags: ["管理コマンド"],
};
