import {
  ActionRowBuilder,
  ButtonBuilder,
  CommandInteraction,
  EmbedBuilder,
  Interaction,
} from "@djs";
import "https://deno.land/std@0.191.0/dotenv/load.ts";
const { ADMIN_ID } = Deno.env.toObject();

const nextButtonId = "next";
const backButtonId = "back";

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
    const rawList = [];

    for await (const entry of ven_list) {
      rawList.push(
        entry.value,
      );
    }

    if (rawList.length === 0) {
      await interaction.reply("**[ERROR]** 自販機に商品はありません。");
      return;
    }

    // @ts-ignore NOTE: LIB SIDE ERROR
    rawList.sort((a, b) => a.price - b.price);

    for (let i = 0; i < rawList.length; i++) {
      list.push(
        `ID: ${rawList[i].id} 「**${rawList[i].title}**」 \n価格: ${
          rawList[i].price
        }人民元 販売元UID: ${rawList[i].user_id}\n`,
      );
    }

    if (rawList.length < 11) {
      const embed = new EmbedBuilder()
        .setColor(0xeb2339)
        .setTitle("自販機 商品一覧")
        .setDescription(`
${list.join("\n")}

\`/ven_buy\` でIDを指定して購入可能です。
`)
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
      });

      return;
    }

    let currentPage = 0;
    const nextButton = new ButtonBuilder().setCustomId(nextButtonId).setLabel(
      "次のページ",
    ).setStyle(2);

    const backButton = new ButtonBuilder().setCustomId(backButtonId).setLabel(
      "前のページ",
    ).setStyle(1);

    const actionRow = new ActionRowBuilder();
    if (currentPage > 0) {
      actionRow.addComponents(backButton);
    }
    if (currentPage < Math.floor((list.length - 1) / 10)) {
      actionRow.addComponents(nextButton);
    }

    const embed = new EmbedBuilder()
      .setColor(0xeb2339)
      .setTitle("自販機 商品一覧")
      .setDescription(`
${list.slice(currentPage * 10, currentPage * 10 + 10).join("\n")}

\`/ven_buy\` でIDを指定して購入可能です。
`)
      .setTimestamp();

    const resp = await interaction.reply({
      embeds: [embed],
      components: [actionRow],
    });

    const collector = resp.createMessageComponentCollector({
      filter: (i: Interaction) =>
        (i.customId === nextButtonId || i.customId === backButtonId) &&
        i.user.id === interaction.user.id,
      time: 30000,
    });

    let nowLoad = false;

    collector.on("collect", async (i) => {
      if (nowLoad) {
        return;
      }

      nowLoad = true;

      if (i.customId === nextButtonId) {
        currentPage += 1;
      } else if (i.customId === backButtonId) {
        currentPage = Math.max(0, currentPage - 1);
      }

      const updatedActionRow = new ActionRowBuilder();
      if (currentPage > 0) {
        updatedActionRow.addComponents(backButton);
      }
      if (currentPage < Math.floor(list.length / 10)) {
        updatedActionRow.addComponents(nextButton);
      }

      const start = currentPage * 10;
      const end = start + 10;
      const currentList = list.slice(start, end);

      const updatedEmbed = new EmbedBuilder()
        .setColor(0xeb2339)
        .setTitle("自販機 商品一覧")
        .setDescription(`
${currentList.join("\n")}

\`/ven_buy\` でIDを指定して購入可能です。
`)
        .setTimestamp();

      await i.update({
        embeds: [updatedEmbed],
        components: [updatedActionRow],
      });

      nowLoad = false;
    });

    collector.on("end", () => {
    });
  },
  tags: ["管理コマンド"],
};
