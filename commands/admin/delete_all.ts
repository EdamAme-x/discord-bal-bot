/// <reference lib="deno.unstable" />
import "https://deno.land/std@0.191.0/dotenv/load.ts";
const { ADMIN_ID } = Deno.env.toObject();

import { CommandInteraction } from "@djs";

export const DeleteAll = {
  title: "delete_all",
  description: "DBを削除",
  type: 1,
  options: [
    {
      name: "confirm",
      type: 4,
      required: true,
      description: "12 + 1の結果を入力して下さい。",
    },
  ],
  handler: async (interaction: CommandInteraction) => {
    if (!(interaction.user.id === ADMIN_ID)) {
      await interaction.reply(
        "**[ERROR]** このコマンドを実行できるのはBOTを動作させているユーザーのみです。",
      );
      return;
    }

    if (parseInt(interaction.options.data[0].value?.toString()) !== 13) {
      await interaction.reply(
        "**[ERROR]** 12 + 1の結果を入力して下さい。",
      );
      return;
    }

    const kv = await Deno.openKv();

    for await (const entry of kv.list({ prefix: [] })) {
      await kv.delete(entry.key);
    }

    await interaction.reply("**[SUCCESS]** DBを削除しました。");
  },
  tags: ["管理コマンド"],
};
