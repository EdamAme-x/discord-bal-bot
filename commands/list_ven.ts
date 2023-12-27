import { CommandInteraction, EmbedBuilder } from "@djs";
import "https://deno.land/std@0.191.0/dotenv/load.ts";
import { toAjail } from "./../lib/hash.ts";

const { ADMIN_ID } = Deno.env.toObject();

export const ListVen = {
  title: "ven_list",
  description: "自販機 商品一覧",
  handler: async (interaction: CommandInteraction) => {
    const kv = await Deno.openKv();
    const ven_list = await kv.list<{
      id: string;
      title: string;
      price: number;
      user_id: string;
    }>({ prefix: ["ven"] });
    const list = [];

    for await (const entry of ven_list) {
      list.push(
        `ID: ${entry.value.id} 「**${entry.value.title}**」 \n価格: ${entry.value.price}人民元 販売元UID: ${entry.value.user_id}\n`,
      );
    }

    const embed = new EmbedBuilder()
      .setColor(0xeb2339)
      .setTitle("自販機 商品一覧")
      .setDescription(`
${list.join("\n")}
`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
  tags: ["管理コマンド"],
};
