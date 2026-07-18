import { Hono } from "hono";
import { requestLogger } from "../shared/middleware/requestLogger";
import { errorHandler } from "../presentation/middleware/errorHandler";
import { TelegramWebhookController } from "../interfaces/telegram/TelegramWebhookController";


interface AppContainer {

  telegramWebhookController:
    TelegramWebhookController;

}


export function createApp(
  container?: AppContainer
) {

  const app = new Hono();


  app.use("*", requestLogger);


  app.onError(errorHandler);



  app.get("/health", (c) => {

    return c.json({

      status: "ok",

      service:
        "waresh-gold-assistant",

      version:
        "0.1.0",

    });

  });



  if(container) {


    app.post(
      "/telegram/webhook",

      (c) =>
        container.telegramWebhookController.handle(c)

    );


  }



  return app;

}