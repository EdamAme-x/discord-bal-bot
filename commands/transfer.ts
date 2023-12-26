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
    }
  ],
  handler: async (interaction: CommandInteraction) => {
    const kv = await Deno.openKv();
    
    if (
      !((await kv.get(["wallet", interaction.options.data[0].user?.id])).value)
    ) {
      await interaction.reply(
        "[INFO] このユーザーはウォレットを作成していません。",
      );
      return;
    }else {
      if ((await kv.get(["wallet", interaction.user.id])).value == null) {
        await interaction.reply(
          "[INFO] 貴方はウォレットを作成していません。",
        );
        return;
      }else {
        try {
          // deno-lint-ignore ban-ts-comment
          // @ts-ignore
          parseInt(interaction.options.data[1].value?.toString());
        } catch (_e) {
          await interaction.reply(
            "[ERROR] 送金額は数値を入力して下さい。",
          );
          return;
        }

        if (parseFloat(interaction.options.data[1].value?.toString()) < 0) {
          await interaction.reply(
            "[ERROR] 送金額は0より大きい値を入力して下さい。",
          );
          return;
        }

        if (parseFloat(interaction.options.data[1].value?.toString()) > (await kv.get(["wallet", interaction.user.id])).value.balance) {
          await interaction.reply(
            "[ERROR] 送金額は残高より少ない値を入力して下さい。",
          );
          return;
        }else {
          const myWallet = (await kv.get(["wallet", interaction.user.id])).value.balance -= parseFloat(interaction.options.data[1].value?.toString()); 
          const targetWallet = (await kv.get(["wallet", interaction.options.data[0].user?.id])).value.balance += parseFloat(interaction.options.data[1].value?.toString()); 
          
          await kv.set(["wallet", interaction.user.id], {
            balance: myWallet,
            id: interaction.user.id,
            created_at: (await kv.get(["wallet", interaction.user.id])).value.created_at
          });

          await kv.set(["wallet", interaction.options.data[0].user?.id], {
            balance: targetWallet,
            id: interaction.options.data[0].user?.id,
            created_at: (await kv.get(["wallet", interaction.options.data[0].user?.id])).value.created_at
          })

          await interaction.reply(
            "[INFO] お金を送金しました。"
          )
        }
      }
    }
  },
  tags: ["管理コマンド"],
};
