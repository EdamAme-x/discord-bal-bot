import { REST, Routes } from "@djs";
import { Client, GatewayIntentBits } from "@djs";
import "https://deno.land/std@0.191.0/dotenv/load.ts";
import { Interaction } from "@djs";
import { Router } from "./router/router.ts";
import { Logger } from "./logger/logger.ts";
import { Ping } from "./commands/help/ping.ts";
import { MyInfo } from "./commands/help/myinfo.ts";
import { YouInfo } from "./commands/help/youinfo.ts";
import { Help } from "./commands/help/help.ts";
import { AddAdmin } from "./commands/admin/add_admin.ts";
import { RemoveAdmin } from "./commands/admin/remove_admin.ts";
import { CreateWallet } from "./commands/wallet/create_wallet.ts";
import { CreaterWallet } from "./commands/wallet/creater_wallet.ts";
import { DeleteWallet } from "./commands/wallet/delete_wallet.ts";
import { AddMoney } from "./commands/wallet/add_money.ts";
import { RemoveMoney } from "./commands/wallet/remove_money.ts";
import { DeleteAll } from "./commands/admin/delete_all.ts";
import { ListAdmin } from "./commands/help/list_admin.ts";
import { ListBalance } from "./commands/wallet/list_balance.ts";
import { ExistWallet } from "./commands/wallet/exist_wallet.ts";
import { Transfer } from "./commands/wallet/transfer.ts";
import { MyWallet } from "./commands/wallet/my_wallet.ts";
import { Work } from "./commands/wallet/work.ts";
import { VenAdd } from "./commands/ven/ven_add.ts";
import { VenRemove } from "./commands/ven/ven_remove.ts";
import { ListVen } from "./commands/ven/list_ven.ts";
import { VenBuy } from "./commands/ven/ven_buy.ts";
import { VenRole } from "./commands/ven/ven_role.ts";
import { VenReset } from "./commands/ven/ven_reset.ts";
import { RemovePower } from "./commands/wallet/remove_power.ts";
import { BackUpData } from "./commands/admin/backup_data.ts";

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
  Work,
  VenAdd,
  VenRemove,
  ListVen,
  VenBuy,
  VenRole,
  VenReset,
  RemovePower,
  BackUpData,
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
  // Command
  if (!interaction.isChatInputCommand()) return;
  Logger.log(`${
    Logger.green(Logger.bold(`[${new Date(Date.now() - 1).toLocaleString()}]`))
  } Call ${Logger.green(Logger.bold("/" + interaction.commandName))} by ${
    Logger.bold(interaction.user?.id ?? "")
  }:${
    interaction.guildId ?? ""
  } `);
  try {
    await router.router(interaction.commandName, interaction, client);
  }catch(e) {
    Logger.log(e, "ERROR");
  }
});

client.login(TOKEN);

Deno.serve((_req: Request) => new Response(Date.now().toString(36)));
