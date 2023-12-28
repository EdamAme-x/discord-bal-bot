/// <reference lib="deno.unstable" />
import "https://deno.land/std@0.191.0/dotenv/load.ts";
const { ADMIN_ID } = Deno.env.toObject();

import { CommandInteraction } from "@djs";

export const RemovePower = {
  title: "remove_power",
  description: "UserIdで人民元を削除、没収",
  type: 1,
  options: [
    {
      name: "user_id",
      type: 3,
      required: true,
      description: "削除したいユーザーID",
    },
    {
      name: "amount",
      type: 4,
      required: true,
      description: "没収金額",
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
        (await kv.get(["wallet", interaction.options.data[0].value ?? ""]))
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
      } catch (_e) {
        await interaction.reply(
          "**[ERROR]** 没収金額は数値を入力して下さい。",
        );
        return;
      }

      await kv.set(["wallet", interaction.options.data[0].value ?? ""], {
        balance: (((await kv.get<Wallet>([
          "wallet",
          interaction.options.data[0].value ?? "",
        ])).value?.balance ?? 0) -
          parseFloat(interaction.options.data[1].value?.toString() ?? "0")),
        id: interaction.options.data[0].value ?? "",
        updated_at: Date.now(),
        username: interaction.options.data[0].value ?? "",
      });
      await interaction.reply(
        `**[SUCCESS]** <@${interaction.options.data[0].value}> から${
          parseFloat(interaction.options.data[1].value?.toString() ?? "0")
        }人民元を削除、没収しました。 \n 残金: ${
          (await kv.get<Wallet>(["wallet", interaction.options.data[0].value ?? ""]))
            .value?.balance ?? 0
        }人民元 `,
      );
    } catch (_error) {
      await interaction.reply("**[ERROR]** 没収に失敗しました。");
      console.log(_error);
    }
  },
  tags: ["銀行コマンド"],
};
