import Discord from "discord.js";

import { timeout } from "./utils.js";

class Core {
  constructor() {
    this.client = new Discord.Client({
      intents: ["GuildVoiceStates", "GuildMessages", "Guilds"],
    });
  }

  setup() {
    this.targetUsers = process.env.MISSING_USERS_IDS.split(",").map((id) => ({
      id: +id,
      lastActivity: null,
    }));

    this.client.login(process.env.CLIENT_TOKEN);

    this.client.on("ready", () => {
      console.log(`Logged in as ${this.client.user.tag}!`);
    });

    this.client.on("voiceStateUpdate", (_, newState) => {
      this.updateUsersAcitivity(newState);
    });
  }

  updateUsersAcitivity(newState) {
    if (newState.member.user.bot) return;

    const { user } = newState.member;

    const idx = this.targetUsers.findIndex((tu) => tu.id === +user.id);

    if (idx === -1) return;

    Object.assign(this.targetUsers[idx], { lastActivity: new Date() });
  }

  getMainChannel() {
    const channel = this.client.channels.cache.find(
      ({ id }) => +id === +process.env.MAIN_CHANNEL_ID
    );

    if (!channel) return console.log("Main channel not found");

    return channel;
  }

  async sendMissingMessage(userId) {
    const channel = this.getMainChannel();

    channel.send(
      `Procura-se <@${userId}> Qualquer pista de sua localização entre em contato pelo telefone 4002-8922`
    );
  }

  async checkUsersActivity() {
    const inactiveUsers = this.targetUsers.filter((e) => !e.lastActivity);

    console.log("inactiveUsers: ", inactiveUsers);

    await Promise.all(
      inactiveUsers.map(async (iu) => {
        await this.sendMissingMessage(iu.id);
      })
    );
  }

  async loop() {
    await timeout(10000);

    await this.checkUsersActivity();

    await this.loop();
  }
}

export default new Core();
