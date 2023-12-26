/// <reference lib="deno.unstable" />
import "https://deno.land/std@0.191.0/dotenv/load.ts";
const { ADMIN_ID } = Deno.env.toObject();

import { CommandInteraction } from "@djs";

export const RemoveAdmin = {
  title: "remove_admin",
  description: "管理ユーザーを削除",
  type: 1,
  options: [
    {
      name: "user",
      type: 6,
      required: true,
      description: "削除したいユーザー",
    },
  ],
  handler: async (interaction: CommandInteraction) => {
    if (!ADMIN_ID) {
      await interaction.reply("[ERROR] ADMIN_ID が設定されていません");
      return;
    }

    if (interaction.member?.user.id === ADMIN_ID) {
      const kv = await Deno.openKv();

      try {
        if (typeof interaction.options.data[0].user?.id == "undefined") {
          new Error("[ERROR] ユーザーを指定してください");
        }

        if (
          (await kv.get(["admin", interaction.options.data[0].user?.id ?? ""]))
            .value == null
        ) {
          await interaction.reply(
            "[WARN] このユーザーは既に削除されています。",
          );
          return;
        }

        await kv.delete(["admin", interaction.options.data[0].user?.id ?? ""]);
        await interaction.reply(
          "[SUCCESS] <@" + interaction.options.data[0].user?.id +
            "> を削除しました。",
        );
      } catch (_error) {
        await interaction.reply("[ERROR] 削除に失敗しました。");
      }
    } else {
      await interaction.reply(
        "[ERROR] このコマンドを実行できるのはBOTを動作させているユーザーのみです。",
      );
    }
  },
  tags: ["管理コマンド"],
};
