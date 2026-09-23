/* eslint-disable no-console */
import { Server } from "http";
import dns from "node:dns";
import app from "./app";
import { envVars } from "./app/config/env";
import { connectDB } from "./app/config/db";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

let server: Server;

const startServer = async () => {
  await connectDB();

  const maskedUrl = envVars.DB_URL.replace(
    /(mongodb\+srv?:\/\/)([^:]+):([^@]+)(@)/,
    "$1$2:****REDACTED****$4"
  );
//   console.log("[DEBUG] DB_URL:", maskedUrl);

  server = app.listen(envVars.PORT, () => {
    console.log(`Server is listening to port ${envVars.PORT}`);
  });
};

(async () => {
  try {
    await startServer();
  } catch (error) {
    console.error("Failed to start server", error);
    process.exitCode = 1;
  }
})();

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received... Server shutting down...");
  if (server) server.close(() => process.exit(1));
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received... Server shutting down...");
  if (server) server.close(() => process.exit(1));
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection detected... Server shutting down...", err);
  if (server) server.close(() => process.exit(1));
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception detected... Server shutting down...", err);
  if (server) server.close(() => process.exit(1));
  process.exit(1);
});
