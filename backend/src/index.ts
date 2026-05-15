import { createServer } from "node:http";
import { app } from "./app.js";
import { connectDB, disconnectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { initSocket } from "./sockets/index.js";

const server = createServer(app);
initSocket(server);

async function bootstrap() {
  server.listen(env.PORT, () => {
    console.log(`Pollinkr API running on port ${env.PORT}`);
    console.log(`Environment: ${env.NODE_ENV}`);
    console.log(`Client origin: ${env.CLIENT_ORIGIN}`);
    console.log(`MongoDB URI configured: ${env.MONGODB_URI ? "yes" : "no"}`);
  });

  connectDB().catch((error: unknown) => {
    console.error("MongoDB connection failed. Check MONGODB_URI and Atlas network access.");
    console.error(error);
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
