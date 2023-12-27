import { CommandInteraction } from "@djs";
import "https://deno.land/std@0.191.0/dotenv/load.ts";

export const ListBalance = {
  title: "list_balance",
  description: "財力ランキング",
  handler: async (interaction: CommandInteraction) => {
    const kv = await Deno.openKv();
    const list: unknown[] = [];

    const kv_list = await kv.list({ prefix: ["wallet"] });

    for await (const entry of kv_list) {
      list.push(entry.value);
    }

    const total = list.reduce((a: number, b) => {
      // @ts-ignore NOTE: LIB SIDE ERROR
      return b.balance + a;
    }, 0);

    // SORT
    list.sort((a, b) => {
      // @ts-ignore NOTE: LIB SIDE ERROR
      return b.balance - a.balance;
    }).slice(0, 10);

    await interaction.reply(`
**[BALANCE LIST]**
${
      list
        // deno-lint-ignore no-explicit-any
        .map((user: any, i: number) => {
          return `${i + 1
          }位 ${
            user.username ?? "amex2189"
          }: ${user.balance.toString()} 人民元`;
        })
        .join("\n")
    }
...
${interaction.user.username} : ${
      // @ts-ignore NOTE: LIB SIDE ERROR
      (await kv.get(["wallet", interaction.user.id ?? ""])).value?.balance ??
        0} 人民元
人民総額: ${total} 人民元
`);
  },
  tags: ["情報コマンド"],
};
