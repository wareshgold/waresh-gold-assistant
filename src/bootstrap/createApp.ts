import { Hono } from "hono";
import { requestLogger } from "../shared/middleware/requestLogger";

export function createApp() {
  const app = new Hono();

  app.use("*", requestLogger);

  app.get("/health", (c) => {
    return c.json({
      status: "ok",
      service: "waresh-gold-assistant",
      version: "0.1.0",
    });
  });

  return app;
}