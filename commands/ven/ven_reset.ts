import { CommandInteraction } from "@djs";
import "https://deno.land/std@0.191.0/dotenv/load.ts";
import { toAjail } from "../../lib/hash.ts";

const { ADMIN_ID } = Deno.env.toObject();

export const VenReset = {
  title: "ven_reset",
  description: "自販機商品初期化",
  type: 1,
  options: [
    {
      name: "confirm",
      type: 5,
      required: true,
      description: "okと入力して下さい。",
    },
  ],
  handler: async (interaction: CommandInteraction) => {
    const kv = await Deno.openKv();

    if (
      interaction.user.id !== ADMIN_ID
    ) {
      await interaction.reply(
        "**[ERROR]** このコマンドを実行できるのはBOTを動作させているユーザーのみです。",
      );
      return;
    }

    if (!interaction.options.data[0].value) {
      await interaction.reply(
        "**[ERROR]** Trueと入力して下さい。",
      );
      return;
    }

    const venList = await kv.list({ prefix: ["ven"] });

    for await (const ven of venList) {
      await kv.delete(ven.key);
    }

    await interaction.reply(`**[SUCCESS]** 自販機商品を初期化しました。`);
  },
  tags: ["管理コマンド"],
};
