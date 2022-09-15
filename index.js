import * as dotenv from "dotenv";
import Client from "./src/client.js";

dotenv.config();

async function main() {
  Client.setup();

  await Client.execute();
}

main();
