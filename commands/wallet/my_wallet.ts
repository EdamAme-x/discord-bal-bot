import { CommandInteraction, EmbedBuilder } from "@djs";
import "https://deno.land/std@0.191.0/dotenv/load.ts";
import { Wallet } from "../../types/all.d.ts";

export const MyWallet = {
  title: "my_wallet",
  description: "自分のウォレット確認",
  handler: async (interaction: CommandInteraction) => {
    const kv = await Deno.openKv();

    if (
      !((await kv.get(["wallet", interaction.user?.id])).value)
    ) {
      await interaction.reply(
        "**[INFO]** 貴方はウォレットを作成していません。 `/create_wallet` を実行してウォレットを作成して下さい。",
      );
      return;
    } else {
      const value =
        (await kv.get<Wallet>(["wallet", interaction.user.id])).value;

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("[MYWALLET]")
            .addFields([
              {
                name: "残高",
                value: `${value?.balance ?? 0} 人民元`,
              },
              {
                name: "最終更新",
                value: new Date(
                  value?.updated_at ?? Date.now(),
                ).toLocaleString("ja-JP"),
              },
            ]),
        ],
      });
    }
  },
  tags: ["銀行コマンド"],
};
