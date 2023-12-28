/// <reference lib="deno.unstable" />
import { CommandInteraction } from "@djs";

function genInt(min = 0, max = 100): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export const Work = {
  title: "work",
  description: "祖国の為に労働 15~25人民元が手に入る",
  handler: async (interaction: CommandInteraction) => {
    const kv = await Deno.openKv();

    try {
      if (
        (await kv.get(["wallet", interaction.user?.id]))
          .value == null
      ) {
        await kv.set(["wallet", interaction.user?.id], {
          balance: 20,
          id: interaction.user?.id,
          updated_at: Date.now(),
          username: interaction.user?.username,
        });

        await interaction.reply(
          `**[INFO]**
ウォレットを持っていなかった為作成しました。
残金: 20 人民元
もう一度 \`/work\` を実行して下さい。
          `,
        );

        return;
      }

      if (
        (await kv.get(["wallet", interaction.user?.id])).value !== null
      ) {
        if (
          ((await kv.get<{
                updated_at: number;
              }>(["work", interaction.user?.id]))
                .value?.updated_at ?? 0) + 1 * 60 * 60 * 1000 > Date.now()
        ) {
          await interaction.reply(
            `**[WARN]** もう働きました。 次の労働可能時間は ${
              new Date(
                ((await kv.get<{
                  updated_at: number;
                }>(["work", interaction.user?.id])).value
                  ?.updated_at ?? 0) + 1 * 60 * 60 * 1000,
              ).toLocaleString("ja-JP")
            }`,
          );
          return;
        }
      }

      const work = genInt(15, 25);

      await kv.set(["wallet", interaction.user?.id], {
        balance: ((await kv.get<Wallet>(["wallet", interaction.user?.id])).value
          ?.balance ?? 0) +
          work,
        id: interaction.user?.id,
        updated_at: Date.now(),
        username: interaction.user?.username,
      });

      await kv.set(["work", interaction.user?.id], {
        updated_at: Date.now(),
      });

      await interaction.reply(
        `**[SUCCESS]** <@${interaction.user?.id}> に ${work}人民元を支給しました。 \n残金: ${
          (await kv.get<Wallet>(["wallet", interaction.user?.id])).value
            ?.balance ??
            0
        }人民元 `,
      );
    } catch (_error) {
      await interaction.reply("**[ERROR]** 作成に失敗しました。");
    }
  },
  tags: ["銀行コマンド"],
};
