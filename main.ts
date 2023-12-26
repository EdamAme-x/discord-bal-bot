import { REST, Routes } from '@djs';
import { Client, GatewayIntentBits } from '@djs';
import "https://deno.land/std@0.191.0/dotenv/load.ts";

const { TOKEN, CLIENT_ID } = Deno.env.toObject();

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

try {
  console.log('\x1b[33m[!] Registering commands...\x1b[0m');

  await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

  console.log('\x1b[32m[!] Successfully\x1b[0m');
} catch (error) {
  console.error(error);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log(`\x1b[32m[!] Logged in as ${client.user?.tag}!\x1b[0m`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

client.login(TOKEN);