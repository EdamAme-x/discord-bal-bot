import { REST, Routes } from '@djs';
import { Client, GatewayIntentBits } from '@djs';
import "https://deno.land/std@0.191.0/dotenv/load.ts";
import { Interaction, CommandInteraction } from '@djs';
import { Router } from './router/router.ts';
import { Logger } from './logger/logger.ts';

const { TOKEN, CLIENT_ID } = Deno.env.toObject();

const commands = [
  {
    title: 'ping',
    description: 'Replies with Pong!',
    handler: async (interaction: CommandInteraction) => {
      await interaction.reply('Pong!');
    },
  },
];

const rest = new REST({ version: '10' }).setToken(TOKEN);
const router = new Router(commands)

try {
  Logger.log(`Command registering.`);
  await rest.put(Routes.applicationCommands(CLIENT_ID), { body: router.routes });
  Logger.log(`Command registered.`);
} catch (_error) {
  Logger.log(`Command registration failed.`, "WARN"); 
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  Logger.log(`Logged in as ${Logger.bold(client.user?.tag ?? "")}`);
});

client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  await router.router(interaction.commandName, interaction);
});

client.login(TOKEN);