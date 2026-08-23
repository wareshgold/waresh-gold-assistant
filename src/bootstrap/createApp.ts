import { Hono }
from "hono";


import { createRequestLogger }
from "../shared/middleware/requestLogger";


import { createRequestContext }
from "../shared/middleware/requestContext";


import { errorHandler }
from "../presentation/middleware/errorHandler";


import { TelegramWebhookController }
from "../interfaces/telegram/TelegramWebhookController";


import { SystemMetricsController }
from "../interfaces/http/SystemMetricsController";


import { MarketPriceProvider }
from "../domain/market/providers/MarketPriceProvider";


import { MarketSnapshotService }
from "../application/market/services/MarketSnapshotService";


import { GetGoldBubbleDataUseCase }
from "../application/market/GetGoldBubbleDataUseCase";


import { SystemMonitoringService }
from "../application/system/observability/SystemMonitoringService";


import { HealthCheckService }
from "../application/system/HealthCheckService";


import { CalculateGoldPriceUseCase }
from "../application/gold/CalculateGoldPriceUseCase";





interface AppContainer {



    telegramWebhookController:
        TelegramWebhookController;



    systemMetricsController:
        SystemMetricsController;



    monitoringService:
        SystemMonitoringService;



    healthCheckService:
        HealthCheckService;



    calculateGoldPriceUseCase:
        CalculateGoldPriceUseCase;



    marketProvider:
        MarketPriceProvider;



    snapshotService:
        MarketSnapshotService;



    getGoldBubbleDataUseCase:
        GetGoldBubbleDataUseCase;



}







export function createApp(

    container: AppContainer

) {



    const app =

        new Hono();






    app.use(

        "*",

        createRequestContext()

    );





    app.use(

        "*",

        createRequestLogger(

            container.monitoringService

        )

    );







    app.onError(

        errorHandler

    );









    app.get(

        "/health",

        async(c)=>{



            const health =

                await container

                    .healthCheckService

                    .execute();






            return c.json({



                service:

                    "waresh-gold-assistant",



                version:

                    "0.1.0",



                ...health



            });



        }

    );









    app.get(
        "/system/metrics",
        async(c)=>{

            const metrics =

                await container

                    .systemMetricsController

                    .handle();


            return c.json(metrics);

        }
    );









    const marketPriceHandler =



        async(c:any)=>{



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



        };









    app.get(

        "/market/gold-price",

        marketPriceHandler

    );







    app.get(

        "/api/v1/market/gold-price",

        marketPriceHandler

    );











    app.get(

        "/market/gold-bubble",

        async(c)=>{



            const bubble =


                await container

                    .getGoldBubbleDataUseCase

                    .execute();






            return c.json({



                marketPrice:

                    bubble.marketPrice,



                intrinsicPrice:

                    bubble.intrinsicPrice,



                bubbleAmount:

                    bubble.bubbleAmount,



                bubblePercentage:

                    bubble.bubblePercentage,



                updatedAt:

                    bubble.updatedAt



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

        "/api/v1/calculate/gold-price",

        async(c)=>{

            const body =

                await c.req.json()

                    .catch(

                        ()=>null

                    ) as Record<

                        string,

                        unknown

                    > | null;


            if (!body) {

                return c.json(

                    {
                        error:
                            "درخواست نامعتبر است."
                    },

                    400

                );

            }


            const numberField = (

                value:

                    unknown

            ):

                number | null => {


                const num =

                    typeof value === "string"

                        ? Number(value)

                        : value;


                return (

                    typeof num === "number" &&

                    Number.isFinite(num)

                )

                    ? num

                    : null;

            };


            const weight =
                numberField(body.weight);

            const goldPrice =
                numberField(body.goldPrice);

            const laborPercent =
                numberField(body.laborPercent);

            const profitPercent =
                numberField(body.profitPercent);

            const taxPercent =
                numberField(body.taxPercent);


            if (

                weight === null ||
                goldPrice === null ||
                laborPercent === null ||
                profitPercent === null ||
                taxPercent === null ||
                weight <= 0 ||
                goldPrice <= 0 ||
                laborPercent < 0 ||
                profitPercent < 0 ||
                taxPercent < 0

            ) {

                return c.json(

                    {
                        error:
                            "مقادیر ورودی معتبر نیستند."
                    },

                    400

                );

            }


            let discount:

                number | undefined;


            if (

                body.discount !== undefined &&
                body.discount !== null &&
                body.discount !== ""

            ) {

                const parsed =
                    numberField(body.discount);


                if (

                    parsed === null ||
                    parsed < 0

                ) {

                    return c.json(

                        {
                            error:
                                "مقادیر ورودی معتبر نیستند."
                        },

                        400

                    );

                }

                discount =
                    parsed;

            }


            const result =

                container

                    .calculateGoldPriceUseCase

                    .execute({

                        weight,

                        goldPrice,

                        laborPercent,

                        profitPercent,

                        taxPercent,

                        ...(discount !== undefined
                            ? { discount }
                            : {})

                    });


            return c.json({

                total:
                    result.total

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







    return app;



}