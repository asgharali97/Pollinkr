import { createServer } from "node:http";
import { app } from "./app.js";
import { connectDB, disconnectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { initSocket } from "./sockets/index.js";

const server = createServer(app);
initSocket(server);

async function bootstrap() {
  await connectDB();

  server.listen(env.PORT, () => {
    console.log(`Pollinkr API running on port ${env.PORT}`);
  });
}

function shutdown(signal: string) {
  console.log(`${signal} received. Shutting down...`);

  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

bootstrap().catch((error: unknown) => {
  console.error("Failed to start Pollinkr API", error);
  process.exit(1);
});
