import { Hono } from "hono";

import { requestLogger }
from "../shared/middleware/requestLogger";

import { errorHandler }
from "../presentation/middleware/errorHandler";

import { TelegramWebhookController }
from "../interfaces/telegram/TelegramWebhookController";

import { MarketPriceProvider }
from "../domain/market/providers/MarketPriceProvider";

import { MarketSnapshotService }
from "../application/market/services/MarketSnapshotService";



interface AppContainer {


  telegramWebhookController:
    TelegramWebhookController;


  marketProvider:
    MarketPriceProvider;


  snapshotService:
    MarketSnapshotService;


}




export function createApp(
  container?: AppContainer
) {


  const app =
    new Hono();



  app.use(
    "*",
    requestLogger
  );



  app.onError(
    errorHandler
  );




  app.get(
    "/health",
    (c)=>{


      return c.json({

        status:"ok",

        service:
          "waresh-gold-assistant",

        version:
          "0.1.0"

      });


    }

  );





  if(container){



    app.get(
      "/market/gold-price",
      async(c)=>{


        const price =
          await container
            .marketProvider
            .getCurrentPrice();



        return c.json({

          gold18Price:
            price.gold18Price,


          currencyPrice:
            price.currencyPrice,


          ouncePrice:
            price.ouncePrice,


          updatedAt:
            price.updatedAt


        });


      }

    );





    app.get(
      "/market/history",
      async(c)=>{


        const limit =
          Number(
            c.req.query("limit") ?? 50
          );



        const history =
          await container
            .snapshotService
            .getHistory(limit);



        return c.json({

          items:
            history

        });


      }

    );





    app.post(
      "/telegram/webhook",

      async(c)=>{


        return await container
          .telegramWebhookController
          .handle(c);


      }

    );



  }




  return app;


}