import { Context } from "hono";

import {
    HealthCheckService
}
from "../../application/health/HealthCheckService";



export class HealthController {



    constructor(

        private readonly healthCheckService:
            HealthCheckService

    ) {}





    async basic(
        c: Context
    ) {



        return c.json({

            status:
                "ok",


            service:
                "waresh-gold-assistant",


            version:
                "0.1.0"


        });


    }






    async detailed(
        c: Context
    ) {


        const result =

            await this.healthCheckService
                .execute();



        const statusCode =

            result.status === "healthy"

                ?
                200

                :
                503;



        return c.json(

            result,

            statusCode

        );


    }



}