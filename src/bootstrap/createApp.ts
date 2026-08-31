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

    );    // Strategy A diagnostic endpoint
    app.get(
        "/api/v1/strategy-a/status",
        async(c) => {
            try {
                const db = (container as any).waresh_gold_db;
                if (!db) {
                    return c.json({ error: "D1 database not available" });
                }

                const sixHoursAgo = Date.now() - 6 * 60 * 60 * 1000;
                const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

                // Count ticks
                const ticks6h = await db.prepare(
                    "SELECT COUNT(*) as count FROM ounce_ticks WHERE timestamp >= ?"
                ).bind(sixHoursAgo).first();

                const ticks24h = await db.prepare(
                    "SELECT COUNT(*) as count FROM ounce_ticks WHERE timestamp >= ?"
                ).bind(oneDayAgo).first();

                const lastTick = await db.prepare(
                    "SELECT price, direction, timestamp FROM ounce_ticks ORDER BY timestamp DESC LIMIT 1"
                ).first();

                // Count signals
                const signals = await db.prepare(
                    "SELECT COUNT(*) as count FROM strategy_a_signals"
                ).first();

                const lastSignal = await db.prepare(
                    "SELECT signal_type, reason, entry_price, generated_at FROM strategy_a_signals ORDER BY generated_at DESC LIMIT 1"
                ).first();

                return c.json({
                    ticks: {
                        last6h: ticks6h?.count ?? 0,
                        last24h: ticks24h?.count ?? 0,
                        lastTick: lastTick ? {
                            price: lastTick.price,
                            direction: lastTick.direction,
                            time: new Date(lastTick.timestamp).toISOString()
                        } : null
                    },
                    signals: {
                        total: signals?.count ?? 0,
                        last: lastSignal ? {
                            type: lastSignal.signal_type,
                            reason: lastSignal.reason,
                            entryPrice: lastSignal.entry_price,
                            time: new Date(lastSignal.generated_at).toISOString()
                        } : null
                    },
                    dataCollection: {
                        hasEnoughData: (ticks6h?.count ?? 0) >= 12,
                        status: (ticks6h?.count ?? 0) >= 12 ? "healthy" : "insufficient"
                    }
                });
            } catch (error) {
                return c.json({ error: String(error) }, 500);
            }
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