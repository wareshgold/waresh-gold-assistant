import { Hono } from "hono";

export function createApp() {
  const app = new Hono();

  app.get("/health", (c) => {
    return c.json({
      status: "ok",
      service: "waresh-gold-assistant",
      version: "0.1.0",
    });
  });

  return app;
}