import { createMiddleware } from "hono/factory";
import { logger } from "../logger/logger";

export const requestLogger = createMiddleware(async (c, next) => {
  const start = Date.now();

  await next();

  const duration = Date.now() - start;

  logger.info("HTTP Request", {
    method: c.req.method,
    path: c.req.path,
    status: c.res.status,
    durationMs: duration,
  });
});