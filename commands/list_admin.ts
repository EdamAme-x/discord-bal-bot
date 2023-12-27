import { CommandInteraction } from "@djs";
import "https://deno.land/std@0.191.0/dotenv/load.ts";
const { ADMIN_ID } = Deno.env.toObject();

export const ListAdmin = {
  title: "list_admin",
  description: "管理人のリスト",
  handler: async (interaction: CommandInteraction) => {
    const kv = await Deno.openKv();
    const list = [];

    const kv_list = await kv.list({ prefix: ["admin"] });

    for await (const entry of kv_list) {
      list.push(entry.value);
    }

    await interaction.reply(`
[SUPER ADMIN]
<@${ADMIN_ID}>
[ADMIN LIST]
${list.reverse().join("\n")}
    `);
  },
  tags: ["情報コマンド"],
};
