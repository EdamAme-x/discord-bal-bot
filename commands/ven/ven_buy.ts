import { Client, CommandInteraction } from "@djs";
import "https://deno.land/std@0.191.0/dotenv/load.ts";
import { toAjail } from "../../lib/hash.ts";

const { ADMIN_ID } = Deno.env.toObject();

export const VenBuy = {
  title: "ven_buy",
  description: "自販機の商品をコマンドで購入",
  type: 1,
  options: [
    {
      name: "id",
      type: 3,
      required: true,
      description: "販売ID",
    },
  ],
  handler: async (interaction: CommandInteraction, client: Client) => {
    const kv = await Deno.openKv();

    if (
      (
        await kv.get([
          "ven",
          interaction.options.data[0].value ?? toAjail("不明"),
        ])
      ).value == null
    ) {
      await interaction.reply("**[ERROR]** その販売IDは存在しません。");
      return;
    }

    if ((await kv.get(["wallet", interaction.user?.id])).value == null) {
      await interaction.reply(
        "**[ERROR]** 貴方はウォレットを持っていません。 `/create_wallet` を実行して下さい。",
      );
      return;
    }

    const target = (await kv.get<{
      id: string;
      title: string;
      price: number;
      user_id: string;
    }>([
      "ven",
      interaction.options.data[0].value ?? toAjail("不明"),
    ])).value;

    if (!target) {
      await interaction.reply(
        `**[ERROR]** エラーが発生しました。 商品ID :${
          interaction.options.data[0].value ?? "不明"
        }を購入することが出来ません。`,
      );
      return;
    }

    const user = (await kv.get<{
      balance: number;
    }>([
      "wallet",
      interaction.user?.id,
    ])).value ?? {
      balance: 0,
    };

    if (target.price > user.balance) {
      await interaction.reply(
        `**[WARN]** 残高が${target.price - user.balance}人民元足りません。`,
      );
      return;
    }

    if (target.user_id.startsWith("&")) {
      const roleId = target.user_id.slice(1);

      try {
        // patch role
        const guild = client.guilds.cache.get(interaction.guildId!);

        // deno-lint-ignore ban-ts-comment
        // @ts-ignore
        const member = guild.members.find((m) => m.id === interaction.user.id);

        member.roles.cache.add(roleId);

        await interaction.reply(
          `**[SUCCESS]** ${target.title} を購入しました。 残高：${
            user.balance - target.price
          }人民元`,
        );
        return;
      } catch (_error) {
        console.log(_error);
        await interaction.reply(
          `**[ERROR]** 購入に失敗しました。既にロールを持っている or 既に消されている or 不具合の可能性があります。`,
        );
      }
      return;
    }

    if (target.user_id === interaction.user?.id) {
      await interaction.reply(
        `**[ERROR]** 自分自身の商品は購入できません。`,
      );
      return;
    }

    try {
      client.users.cache.get(target.user_id)?.send(`
SERVER_ID: ${interaction.guildId} にて商品 ${target.title} が購入されました。
購入者: <@${interaction.user?.id}>
`);
    } catch (_error) {
      console.log(_error);
      await interaction.reply(
        `**[ERROR]** 送信に失敗しました。 販売元<@${target.user_id}>がDM開放をしていない事が原因の可能性が有ります。`,
      );

      return;
    }

    await kv.set([
      "wallet",
      interaction.user?.id,
    ], {
      id: interaction.user?.id,
      balance: user.balance - target.price,
      username: interaction.user?.username,
      updated_at: Date.now(),
    });

    let sell = false;

    if ((await kv.get(["wallet", target.user_id])).value !== null) {
      await kv.set([
        "wallet",
        target.user_id,
      ], {
        id: target.user_id,
        balance:
          ((await kv.get<Wallet>(["wallet", target.user_id])).value?.balance ??
            0) +
          target.price,
        username:
          (await kv.get<Wallet>(["wallet", target.user_id])).value?.username ??
            target.user_id,
        updated_at: Date.now(),
      });

      sell = true;
    }

    await interaction.reply(
      `**[SUCCESS]** <@${target.user_id}> から${target.title}を購入しました。残高: ${
        user.balance - target.price
      } 人民元
販売元に通知しました。 販売品が届かない場合、\`/list_admin\` から管理者を探し、返金して貰ってください。
${
        sell
          ? "販売元に振込しました。"
          : "販売元がウォレットを持っていなかった為、振込に失敗しました。"
      }`,
    );
  },
  tags: ["管理コマンド"],
};
