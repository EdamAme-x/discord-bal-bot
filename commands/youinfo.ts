import { CommandInteraction, EmbedBuilder } from "@djs";

export const YouInfo = {
  title: "youinfo",
  description: "メンションした人の情報",
  type: 1,
  options: [
    {
      name: "user",
      type: 6,
      required: true,
      description: "メンションしたいユーザー",
    },
  ],
  handler: async (interaction: CommandInteraction) => {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle("[YOUINFO]")
          .setURL("https://twitter.com/amex2189")
          .setAuthor({
            name: interaction.options.data[0].user?.username ?? "実行者不明",
            iconURL: `https://cdn.discordapp.com/avatars/${
              interaction.options.data[0].user?.id
            }/${interaction.options.data[0].user?.avatar}.webp?size=128`,
            url: `https://cdn.discordapp.com/avatars/${
              interaction.options.data[0].user?.id
            }/${interaction.options.data[0].user?.avatar}.webp?size=128`,
          })
          .setDescription(`USER_ID: ${interaction.options.data[0].user?.id}`)
          .addFields(
            {
              name: "アカウント作成日時",
              value: new Date(
                interaction.options.data[0].user?.createdAt ?? Date.now(),
              ).toLocaleString("ja-JP"),
            },
            {
              name: "アカウントタイプ",
              value: interaction.options.data[0].user?.bot ? "Bot" : "User",
            },
          )
          .setTimestamp(),
      ],
    });
  },
  tags: ["テストコマンド"]
};
