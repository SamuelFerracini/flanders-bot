import * as dotenv from "dotenv";
dotenv.config();

import Discord from "discord.js";

const client = new Discord.Client({
  intents: ["GuildVoiceStates"],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("voiceStateUpdate", (oldState, newState) => {
  if (newState.member.user.bot) return;

  const { user } = newState.member;

  console.log(user);
});

client.login(process.env.CLIENT_TOKEN);
