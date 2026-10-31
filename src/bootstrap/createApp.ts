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

    // Strategy A debug endpoint - shows last candles and rejection reasons
    app.get(
        "/api/v1/strategy-a/debug",
        async(c) => {
            try {
                const db = (container as any).waresh_gold_db;
                if (!db) {
                    return c.json({ error: "D1 database not available" });
                }

                // Get last 30 ticks (enough for M5 candles)
                const ticks = await db.prepare(
                    "SELECT price, direction, timestamp FROM ounce_ticks ORDER BY timestamp DESC LIMIT 30"
                ).all();

                if (!ticks.results || ticks.results.length === 0) {
                    return c.json({ error: "No ticks found" });
                }

                // Build candles (M5)
                const bucketMs = 5 * 60 * 1000;
                const buckets = new Map();
                const sortedTicks = ticks.results.reverse().map((t: any) => ({
                    price: Number(t.price),
                    direction: t.direction,
                    timestamp: Number(t.timestamp)
                }));

                for (const tick of sortedTicks) {
                    const bucketStart = Math.floor(tick.timestamp / bucketMs) * bucketMs;
                    if (!buckets.has(bucketStart)) buckets.set(bucketStart, []);
                    buckets.get(bucketStart).push(tick);
                }

                const candles = [...buckets.entries()]
                    .sort((a, b) => a[0] - b[0])
                    .map(([ts, bucket]) => {
                        const prices = bucket.map((t: any) => t.price);
                        return {
                            timestamp: new Date(ts).toISOString(),
                            open: prices[0],
                            high: Math.max(...prices),
                            low: Math.min(...prices),
                            close: prices[prices.length - 1],
                            volume: prices.length
                        };
                    });

                // Analyze last 5 candles for spike conditions
                const last5 = candles.slice(-5);
                const avgRange = last5.reduce((s, c) => s + (c.high - c.low), 0) / last5.length;

                const analysis = last5.map((candle, i) => {
                    const range = candle.high - candle.low;
                    const body = Math.abs(candle.close - candle.open);
                    const bodyRatio = range > 0 ? body / range : 0;
                    const isBullish = candle.close > candle.open;
                    const isStrong = bodyRatio >= 0.65;

                    // Check gap with previous candle
                    let gapInfo = "N/A (first candle)";
                    if (i > 0) {
                        const prev = last5[i - 1];
                        const buyGap = candle.low - prev.high;
                        const sellGap = prev.low - candle.high;
                        gapInfo = `BUY gap: ${buyGap.toFixed(2)}, SELL gap: ${sellGap.toFixed(2)}`;
                    }

                    return {
                        time: candle.timestamp,
                        O: candle.open,
                        H: candle.high,
                        L: candle.low,
                        C: candle.close,
                        range: range.toFixed(2),
                        body: body.toFixed(2),
                        bodyRatio: (bodyRatio * 100).toFixed(1) + "%",
                        direction: isBullish ? "BULL" : "BEAR",
                        isStrong: isStrong ? "✅" : `❌ (${(bodyRatio * 100).toFixed(1)}% < 65%)`,
                        gap: i > 0 ? gapInfo : "N/A"
                    };
                });

                // Check why spike fails
                const reasons = [];

                // Check body ratio
                const strongCandles = last5.filter(c => {
                    const range = c.high - c.low;
                    const body = Math.abs(c.close - c.open);
                    return range > 0 && (body / range) >= 0.65;
                });
                if (strongCandles.length < 3) {
                    reasons.push(`Only ${strongCandles.length}/5 candles have 65%+ body ratio`);
                }

                // Check gaps
                let hasAnyGap = false;
                for (let i = 1; i < last5.length; i++) {
                    const prev = last5[i - 1];
                    const curr = last5[i];
                    if (curr.low > prev.high || curr.high < prev.low) {
                        hasAnyGap = true;
                        break;
                    }
                }
                if (!hasAnyGap) {
                    reasons.push("No P-Gap found between consecutive candles (all overlap)");
                }

                return c.json({
                    candleCount: candles.length,
                    avgRange: avgRange.toFixed(2),
                    last5Candles: analysis,
                    rejectionReasons: reasons,
                    config: {
                        minBodyRatio: "65%",
                        minSpikeCandles: 3,
                        minSpikeMovePercent: "0.12%",
                        minGapRatio: "15% of avg range",
                        pGapRequired: "YES (mandatory)"
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