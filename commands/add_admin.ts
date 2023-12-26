/// <reference lib="deno.unstable" />
import "https://deno.land/std@0.191.0/dotenv/load.ts";
const { ADMIN_ID } = Deno.env.toObject();

import { CommandInteraction } from "@djs";

export const AddAdmin = {
  title: "add_admin",
  description: "管理ユーザーを追加",
  type: 1,
  options: [
    {
      name: "user",
      type: 6,
      required: true,
      description: "追加したいユーザー",
    }
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

            await kv.set(["admin", interaction.options.data[0].user?.id ?? ""], true);
            await interaction.reply("[SUCCESS] <@" + interaction.options.data[0].user?.id + "> を追加しました。");
        }catch (_error) {
            await interaction.reply("[ERROR] 追加に失敗しました。");
        }
    }else {
        await interaction.reply("[ERROR] このコマンドを実行できるのはBOTを動作させているユーザーのみです。");
    }
  },
  tags: ["管理コマンド"]
};
