import { app } from "./app.js";
import { env } from "./config/env.js";
import { closeOcrWorker } from "./services/document/ocr.service.js";

const server = app.listen(env.port, "0.0.0.0", () =>
  console.log(`API listening on port ${env.port}`),
);

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, async () => {
    await closeOcrWorker();
    server.close(() => process.exit(0));
  });
}
