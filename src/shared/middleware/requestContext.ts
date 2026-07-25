import { createMiddleware } from "hono/factory";



function generateRequestId(): string {

    return `wrs_${crypto.randomUUID()}`;

}



export function createRequestContext() {


    return createMiddleware(async (c, next) => {


        const requestId = generateRequestId();



        c.set(
            "requestId",
            requestId
        );



        c.header(
            "X-Request-ID",
            requestId
        );



        await next();


    });


}