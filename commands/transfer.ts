import { CommandInteraction } from "@djs";
import "https://deno.land/std@0.191.0/dotenv/load.ts";

export const Transfer = {
  title: "transfer",
  description: "お金を他の人に送金",
  type: 1,
  options: [
    {
      name: "user",
      type: 6,
      required: true,
      description: "送金先",
    },
    {
      name: "amount",
      type: 4,
      required: true,
      description: "送金額",
    },
  ],
  handler: async (interaction: CommandInteraction) => {
    const kv = await Deno.openKv();

    if (
      !((await kv.get(["wallet", interaction.options.data[0].user?.id ?? ""]))
        .value)
    ) {
      await interaction.reply(
        "**[INFO]** このユーザーはウォレットを作成していません。",
      );
      return;
    } else {
      if ((await kv.get(["wallet", interaction.user.id])).value == null) {
        await interaction.reply(
          "**[INFO]** 貴方はウォレットを作成していません。",
        );
        return;
      } else {
        try {
          // deno-lint-ignore ban-ts-comment
          // @ts-ignore
          parseInt(interaction.options.data[1].value?.toString());
        } catch (_e) {
          await interaction.reply(
            "**[ERROR]** 送金額は数値を入力して下さい。",
          );
          return;
        }

        if (interaction.user.id === interaction.options.data[0].user?.id) {
          await interaction.reply(
            "**[ERROR]** 自分に送金することはできません。",
          );
          return;
        }

        if (
          parseFloat(interaction.options.data[1].value?.toString() ?? "0") < 0
        ) {
          await interaction.reply(
            "**[ERROR]** 送金額は0より大きい値を入力して下さい。",
          );
          return;
        }

        if (
          parseFloat(interaction.options.data[1].value?.toString() ?? "0") >
            // @ts-ignore NOTE: LIB SIDE ERROR
            (await kv.get(["wallet", interaction.user.id])).value?.balance
        ) {
          await interaction.reply(
            "**[ERROR]** 送金額は残高より少ない値を入力して下さい。",
          );
          return;
        } else {
          const myWallet = (await kv.get(["wallet", interaction.user.id])).value
            // @ts-ignore NOTE: LIB SIDE ERROR
            ?.balance - parseFloat(
              interaction.options.data[1].value?.toString() ?? "0",
            );
          const targetWallet = (await kv.get([
            "wallet",
            interaction.options.data[0].user?.id ?? "",
          ]))
            // @ts-ignore NOTE: LIB SIDE ERROR
            .value?.balance + parseFloat(
              interaction.options.data[1].value?.toString() ?? "0",
            );

          await kv.set(["wallet", interaction.user.id], {
            balance: myWallet,
            id: interaction.user.id,
            updated_at: Date.now(),
            username: interaction.user.username,
          });

          await kv.set(["wallet", interaction.options.data[0].user?.id ?? ""], {
            balance: targetWallet,
            id: interaction.options.data[0].user?.id,
            updated_at: Date.now(),
            username: interaction.options.data[0].user?.username,
          });

          await interaction.reply(
            `**[INFO]** ${
              interaction.options.data[1].value
            } 人民元を送金しました。
送金元: ${interaction.user.username}
送金先: ${interaction.options.data[0].user?.username}
            `,
          );
        }
      }
    }
  },
  tags: ["管理コマンド"],
};
