import { REST, Routes } from "@djs";
import { Client, GatewayIntentBits } from "@djs";
import { Interaction } from "@djs";
import { Router } from "./router/router.ts";
import { Logger } from "./logger/logger.ts";
import { Ping } from "./commands/ping.ts";
import { MyInfo } from "./commands/myinfo.ts";
import { YouInfo } from "./commands/youinfo.ts";
import { Help } from "./commands/help.ts";
import "https://deno.land/std@0.191.0/dotenv/load.ts";
import { AddAdmin } from './commands/add_admin.ts';

const { TOKEN, CLIENT_ID } = Deno.env.toObject();

export const commands = [
  Ping,
  MyInfo,
  YouInfo,
  Help,
  AddAdmin
];

const rest = new REST({ version: "10" }).setToken(TOKEN);
const router = new Router(commands);

try {
  Logger.log(`Command registering.`);
  await rest.put(Routes.applicationCommands(CLIENT_ID), {
    body: router.routes,
  });
  Logger.log(`Command registered.`);
} catch (error) {
  Logger.log(`Command registration failed.`, "WARN");
  Logger.log(error, "WARN");
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
