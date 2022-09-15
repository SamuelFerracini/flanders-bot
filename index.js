import * as dotenv from "dotenv";
import Client from "./src/client.js";

import cron from "node-cron";

dotenv.config();

async function main() {
  Client.setup();

  console.log("CRON_PATTERN: ", process.env.CRON_PATTERN);

  cron.schedule(process.env.CRON_PATTERN, () => {
    Client.checkUsersActivity();
  });
}

main();
