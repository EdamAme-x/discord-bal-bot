import { CommandInteraction } from "@djs";
import "https://deno.land/std@0.191.0/dotenv/load.ts";

export const ListBalance = {
  title: "list_balance",
  description: "財力ランキング",
  handler: async (interaction: CommandInteraction) => {
    const kv = await Deno.openKv();
    const list: {
      balance: number;
      id: string;
      created_at: string;
    } = []

    const kv_list = (await kv.list({ prefix: ["wallet"] }));

    for await (const entry of kv_list) {
      list.push(entry.value)
    }

    // SORT
    list.sort((a, b) => {
      return b.balance - a.balance
    }).slice(0, 10);

    await interaction.reply(`
[BALANCE LIST]
${list
      .map((user, i) => {
        return `${i + 1}位 <@${user.id}>: ${user.balance.toString()} 人民元`
      })
      .join("\n")}
...
${interaction.user.username} : ${(await kv.get(["wallet", interaction.user.id ?? ""])).value?.balance ?? 0} 人民元
`);
  },
  tags: ["情報コマンド"],
};
