import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import extractionRouter from "./routes/extraction.route.js";

export const app = express();

app.use(cors({ origin: env.frontendUrl }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api", extractionRouter);

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    const message =
      err instanceof Error ? err.message : "Unexpected server error";
    res.status(500).json({ error: message });
  },
);
