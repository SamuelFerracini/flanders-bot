import * as dotenv from "dotenv";
import Core from "./src/core.js";

dotenv.config();

async function main() {
  Core.setup();

  await Core.loop();
}

main();
