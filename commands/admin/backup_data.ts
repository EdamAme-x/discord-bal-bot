/// <reference lib="deno.unstable" />
import "https://deno.land/std@0.191.0/dotenv/load.ts";
const { ADMIN_ID } = Deno.env.toObject();

import { CommandInteraction } from "@djs";

export const BackUpData = {
  title: "backup_data",
  description: "データをバックアップ用",
  handler: async (interaction: CommandInteraction) => {
    if (!(interaction.user.id === ADMIN_ID)) {
      await interaction.reply(
        "**[ERROR]** このコマンドを実行できるのはBOTを動作させているユーザーのみです。",
      );
      return;
    }

    const kv = await Deno.openKv();
    const allList = await kv.list({ prefix: [] });
    const rawList = [];

    for await (const entry of allList) {
      delete entry.versionstamp;
      rawList.push(entry);
    }

    const data = JSON.stringify(rawList);
    const now = Date.now();

    await kv.close();
    await Deno.writeTextFile(
      "backup/backup_data." + now + ".json",
      data,
    );
    await interaction.reply(`**[SUCCESS]** データをバックアップ完了。\n\`/backup/backup_data.${now}.json\`に保存しました。`);
  },
  tags: ["管理コマンド"],
};
