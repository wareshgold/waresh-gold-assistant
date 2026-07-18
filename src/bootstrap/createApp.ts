import { Hono } from "hono";
import { requestLogger } from "../shared/middleware/requestLogger";
import { errorHandler } from "../presentation/middleware/errorHandler";

export function createApp(container?: unknown) {
  const app = new Hono();

  app.use("*", requestLogger);

  app.onError(errorHandler);

  app.get("/health", (c) => {
    return c.json({
      status: "ok",
      service: "waresh-gold-assistant",
      version: "0.1.0",
    });
  });

  return app;
}