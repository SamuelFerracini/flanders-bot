import dayjs from "dayjs";

import Discord from "discord.js";

import { timeout } from "./utils.js";
import Messenger from "./messenger.js";

class Client {
  constructor() {
    this.client = new Discord.Client({
      intents: ["GuildVoiceStates", "GuildMessages", "Guilds"],
    });
  }

  setup() {
    this.targetUsers = process.env.MISSING_USERS_IDS.split(",").map((id) => ({
      id,
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

    const idx = this.targetUsers.findIndex((tu) => tu.id === user.id);

    if (idx === -1) return;

    Object.assign(this.targetUsers[idx], {
      lastActivity: new Date(),
    });
  }

  getMainChannel() {
    const channel = this.client.channels.cache.find(
      ({ id }) => id === process.env.MAIN_CHANNEL_ID
    );

    if (!channel) throw new Error("Main channel not found");

    return channel;
  }

  sendMissingMessage(user) {
    const channel = this.getMainChannel();

    Messenger.sendMessage(user, channel);
  }

  hasExpired(date) {
    if (!date) return true;

    const timeToExpire = dayjs(date).add(12, "hours");

    const now = new Date();

    const hasExpired = !dayjs(now).isBefore(timeToExpire);

    return hasExpired;
  }

  async checkUsersActivity() {
    const inactiveUsers = this.targetUsers.filter((e) =>
      this.hasExpired(e.lastActivity)
    );

    await Promise.all(
      inactiveUsers.map(async (u) => {
        const discordUser = await this.client.users.fetch(u.id);

        this.sendMissingMessage(discordUser);
      })
    );
  }

  async execute() {
    const interval = +process.env.LOOP_INTERVAL_SEC || 12 * 60 * 60;

    const intervalMilisecs = interval * 1000;

    console.log("intervalMilisecs: ", intervalMilisecs);

    await timeout(intervalMilisecs);

    await this.checkUsersActivity();

    await this.execute();
  }
}

export default new Client();
