/// <reference lib="deno.unstable" />
import "https://deno.land/std@0.191.0/dotenv/load.ts";
const { ADMIN_ID } = Deno.env.toObject();

import { CommandInteraction } from "@djs";

export const DeleteAll = {
  title: "delete_all",
  description: "DBを削除",
  handler: async (interaction: CommandInteraction) => {
    if (!(interaction.user.id === ADMIN_ID)) {
      await interaction.reply(
        "[ERROR] このコマンドを実行できるのはBOTを動作させているユーザーのみです。",
      );
      return;
    }

    const kv = await Deno.openKv();

    for await (const entry of kv.list({ prefix: [] })) {
      await kv.delete(entry.key);
    }

    await interaction.reply("[SUCCESS] DBを削除しました。");
  },
  tags: ["管理コマンド"],
};
