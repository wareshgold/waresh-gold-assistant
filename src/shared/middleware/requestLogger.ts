import { createMiddleware } from "hono/factory";

import { logger } from "../logger/logger";

import { MetricRecorder } from "../../application/system/observability/MetricRecorder";

import { MetricType } from "../../domain/system/observability/MetricType";



export function createRequestLogger(
    metrics?: MetricRecorder
) {


    return createMiddleware(async (c, next) => {


        const start = Date.now();



        await next();



        const duration = Date.now() - start;



        if(metrics) {


            await metrics.record(

                MetricType.HTTP_REQUEST_COUNT,

                1

            );



            await metrics.record(

                MetricType.HTTP_REQUEST_DURATION,

                duration

            );


        }




        logger.info(

            "HTTP Request",

            {

                method:

                    c.req.method,


                path:

                    c.req.path,


                status:

                    c.res.status,


                durationMs:

                    duration,


            }

        );


    });


}