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
import { AddAdmin } from "./commands/add_admin.ts";
import { RemoveAdmin } from "./commands/remove_admin.ts";
import { CreateWallet } from "./commands/create_wallet.ts";
import { CreaterWallet } from "./commands/creater_wallet.ts";
import { DeleteWallet } from "./commands/delete_wallet.ts";
import { AddMoney } from "./commands/add_money.ts";
import { RemoveMoney } from "./commands/remove_money.ts";
import { DeleteAll } from "./commands/delete_all.ts";
import { ListAdmin } from "./commands/list_admin.ts";
import { ListBalance } from "./commands/list_balance.ts";
import { ExistWallet } from "./commands/exist_wallet.ts";
import { Transfer } from "./commands/transfer.ts";
import { MyWallet } from "./commands/my_wallet.ts";

const { TOKEN, CLIENT_ID } = Deno.env.toObject();

export const commands = [
  Ping,
  MyInfo,
  YouInfo,
  Help,
  AddAdmin,
  RemoveAdmin,
  CreateWallet,
  CreaterWallet,
  DeleteWallet,
  AddMoney,
  RemoveMoney,
  DeleteAll,
  ListAdmin,
  ListBalance,
  ExistWallet,
  Transfer,
  MyWallet,
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
