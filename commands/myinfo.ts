import { CommandInteraction, EmbedBuilder } from "@djs";

export const MyInfo = {
  title: "myinfo",
  description: "実行者の情報",
  handler: async (interaction: CommandInteraction) => {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle("[MYINFO]")
          .setURL("https://twitter.com/amex2189")
          .setAuthor({
            name: interaction.user.username,
            iconURL:
              `https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}.webp?size=128`,
            url:
              `https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}.webp?size=128`,
          })
          .setDescription(`USER_ID: ${interaction.member?.user.id}`)
          .addFields({
            name: "アカウント作成日時",
            value: new Date(interaction.user.createdAt).toLocaleString("ja-JP"),
          }, {
            name: "アカウントタイプ",
            value: interaction.member?.user.bot ? "Bot" : "User",
          })
          .setTimestamp(),
      ],
    });
  },
  tags: ["テストコマンド"]
};
