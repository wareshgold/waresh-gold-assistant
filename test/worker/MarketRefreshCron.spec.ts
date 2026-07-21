import {
    env,
    createExecutionContext,
    waitOnExecutionContext,
} from "cloudflare:test";


import { describe, expect, it } from "vitest";


import worker from "../../src/index";



describe(
    "Market Refresh Cron",
    ()=>{


        it(
            "should execute scheduled market refresh",
            async()=>{


                const ctx =
                    createExecutionContext();



                await worker.scheduled(

                    {} as ScheduledEvent,

                    env,

                    ctx

                );



                await waitOnExecutionContext(
                    ctx
                );



                const result =
                    await env.waresh_gold_db
                        .prepare(
                            `
                            SELECT COUNT(*) as count
                            FROM market_snapshots
                            `
                        )
                        .first<any>();



                expect(
                    Number(result?.count)
                )
                .toBeGreaterThan(
                    0
                );


            }
        );


    }
);