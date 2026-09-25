import { app } from "./app.js";
import { env } from "./config/env.js";
import { closeOcrWorker } from "./services/document/ocr.service.js";

const server = app.listen(env.port, () =>
  console.log(`API listening on http://localhost:${env.port}`),
);

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, async () => {
    await closeOcrWorker();
    server.close(() => process.exit(0));
  });
}
