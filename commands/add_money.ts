/// <reference lib="deno.unstable" />
import "https://deno.land/std@0.191.0/dotenv/load.ts";
const { ADMIN_ID } = Deno.env.toObject();

import { CommandInteraction } from "@djs";

export const AddMoney = {
  title: "add_money",
  description: "人民元を発行、振込",
  type: 1,
  options: [
    {
      name: "user",
      type: 6,
      required: true,
      description: "振込したいユーザー",
    },
    {
      name: "amount",
      type: 4,
      required: true,
      description: "振込金額",
    },
  ],
  handler: async (interaction: CommandInteraction) => {
    const kv = await Deno.openKv();

    if (
      !(interaction.user.id === ADMIN_ID ||
        (await kv.get(["admin", interaction.user.id])).value)
    ) {
      await interaction.reply(
        "**[ERROR]** このコマンドを実行できるのはBOTを動作させているユーザーと管理者のみです。",
      );
      return;
    }

    try {
      if (
        (await kv.get(["wallet", interaction.options.data[0].user?.id ?? ""]))
          .value == null
      ) {
        await interaction.reply(
          "**[WARN]** このユーザーはウォレットを作成していません。",
        );
        return;
      }

      try {
        // deno-lint-ignore ban-ts-comment
        // @ts-ignore
        parseInt(interaction.options.data[1].value?.toString());

        if (parseInt(interaction.options.data[1].value?.toString()) < 0) {
          await interaction.reply(
            "**[ERROR]** 価格は0以上の数値を入力して下さい。",
          );
          return;
        }
  
        if (isNaN(parseInt(interaction.options.data[1].value?.toString()))) {
          await interaction.reply(
            "**[ERROR]** 価格は数値を入力して下さい。",
          );
          return;
        }
      } catch (_e) {
        await interaction.reply(
          "**[ERROR]** 振込金額は数値を入力して下さい。",
        );
        return;
      }

      await kv.set(["wallet", interaction.options.data[0].user?.id ?? ""], {
        balance: (((await kv.get<{
          balance: number;
          id: string;
          username: string;
          updated_at: number;
        }>([
          "wallet",
          interaction.options.data[0].user?.id ?? "",
        ])).value?.balance ?? 0) +
          parseFloat(interaction.options.data[1].value?.toString() ?? "0")),
        id: interaction.options.data[0].user?.id ?? "",
        updated_at: Date.now(),
        username: interaction.options.data[0].user?.username ?? "",
      });
      await interaction.reply(
        `**[SUCCESS]** <@${interaction.options.data[0].user?.id}> に${
          parseFloat(interaction.options.data[1].value?.toString() ?? "0")
        }人民元を発行、振込しました。 \n 残金: ${
          (await kv.get<{
            balance: number;
            id: string;
            username: string;
            updated_at: number;
          }>(["wallet", interaction.options.data[0].user?.id ?? ""]))
            .value?.balance
        }人民元 `,
      );
    } catch (_error) {
      await interaction.reply("**[ERROR]** 振込に失敗しました。");
      console.log(_error);
    }
  },
  tags: ["銀行コマンド"],
};
