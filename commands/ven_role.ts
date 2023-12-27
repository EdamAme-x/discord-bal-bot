import { CommandInteraction } from "@djs";
import "https://deno.land/std@0.191.0/dotenv/load.ts";
import { toAjail } from "./../lib/hash.ts";

const { ADMIN_ID } = Deno.env.toObject();

export const VenRole = {
  title: "ven_role",
  description: "自販機ロール商品追加",
  type: 1,
  options: [
    {
      name: "role",
      type: 8,
      required: true,
      description: "販売ロール",
    },
    {
      name: "price",
      type: 3,
      required: true,
      description: "販売価格",
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
        "**[ERROR]** 価格は数値を入力して下さい。",
      );
      return;
    }

    const base = {
      user_id: "&" + interaction.options.data[0].role?.id,
      title: interaction.options.data[0].role?.name ?? "不明",
      id: toAjail(interaction.options.data[1].value?.toString() ?? "不明"),
      price: parseInt(interaction.options.data[1].value?.toString() ?? "0") ??
        0,
    };

    await kv.set(["ven", base.id], base);

    await interaction.reply(`**[SUCCESS]** 自販機にロール商品を追加しました。
販売ロール: ${base.title}
販売ID: ${base.id}
販売価格: ${base.price} 人民元

購入時に自動的に付与されます。
`);
  },
  tags: ["管理コマンド"],
};
