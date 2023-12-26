import { REST, Routes } from "@djs";
import { Client, GatewayIntentBits, EmbedBuilder } from "@djs";
import "https://deno.land/std@0.191.0/dotenv/load.ts";
import { Interaction, CommandInteraction } from "@djs";
import { Router } from "./router/router.ts";
import { Logger } from "./logger/logger.ts";

const { TOKEN, CLIENT_ID } = Deno.env.toObject();

const commands = [
  {
    title: "ping",
    description: "応答速度を測定",
    handler: async (interaction: CommandInteraction) => {
      const first = performance.now();
      await interaction.reply("[測定中...]");
      const second = performance.now();
      await interaction.editReply(
        `応答速度: ${
          Math.floor((second - first) * 1000) / 2000
        }ms\nCreated by @amex2189`
      );
    },
  },
  {
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
              iconURL: `https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}.webp?size=128`,
              url: `https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}.webp?size=128`,
            })
            .setDescription(`USER_ID: ${interaction.member?.user.id}`)
            .addFields({
              name: "アカウント作成日時",
              value: new Date(interaction.user.createdAt).toLocaleString("ja-JP"),
            },{
              name: "アカウントタイプ",
              value: interaction.member?.user.bot ? "Bot" : "User",
            })
            .setTimestamp(),
        ],
      });
    },
  },
];

const rest = new REST({ version: "10" }).setToken(TOKEN);
const router = new Router(commands);

try {
  Logger.log(`Command registering.`);
  await rest.put(Routes.applicationCommands(CLIENT_ID), {
    body: router.routes,
  });
  Logger.log(`Command registered.`);
} catch (_error) {
  Logger.log(`Command registration failed.`, "WARN");
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on("ready", () => {
  Logger.log(`Logged in as ${Logger.bold(client.user?.tag ?? "")}`);
});

client.on("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  await router.router(interaction.commandName, interaction);
});

client.login(TOKEN);
