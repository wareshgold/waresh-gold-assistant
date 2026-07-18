import type { LogContext, LogLevel } from "./types";

class Logger {
  private write(
    level: LogLevel,
    message: string,
    context?: LogContext
  ) {
    console.log(
      JSON.stringify({
        level,
        message,
        context,
        timestamp: new Date().toISOString(),
      })
    );
  }

  debug(message: string, context?: LogContext) {
    this.write("debug", message, context);
  }

  info(message: string, context?: LogContext) {
    this.write("info", message, context);
  }

  warn(message: string, context?: LogContext) {
    this.write("warn", message, context);
  }

  error(message: string, context?: LogContext) {
    this.write("error", message, context);
  }
}

export const logger = new Logger();