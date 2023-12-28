import { CommandInteraction } from "@djs";
import "https://deno.land/std@0.191.0/dotenv/load.ts";
import { toAjail } from "../../lib/hash.ts";

const { ADMIN_ID } = Deno.env.toObject();

export const VenRemove = {
  title: "ven_remove",
  description: "自販機商品削除",
  type: 1,
  options: [
    {
      name: "id",
      type: 3,
      required: true,
      description: "販売ID",
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

    if (
      (await kv.get([
        "ven",
        interaction.options.data[0].value ?? toAjail("不明"),
      ])).value == null
    ) {
      await interaction.reply(
        "**[ERROR]** その販売IDは存在しません。",
      );
      return;
    }

    await kv.delete([
      "ven",
      interaction.options.data[0].value ?? toAjail("不明"),
    ]);

    await interaction.reply(`**[SUCCESS]** 自販機から商品を削除しました。
販売ID: ${interaction.options.data[0].value ?? "不明"}
`);
  },
  tags: ["管理コマンド"],
};
