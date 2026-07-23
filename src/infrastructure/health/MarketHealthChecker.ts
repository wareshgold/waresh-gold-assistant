import { HealthChecker }
from "../../application/system/GetSystemHealthUseCase";


import { ComponentHealth }
from "../../domain/system/health/ComponentHealth";


import { MarketPriceProvider }
from "../../domain/market/providers/MarketPriceProvider";



export class MarketHealthChecker
implements HealthChecker {



    constructor(

        private readonly marketProvider:
            MarketPriceProvider

    ) {}





    async check():
        Promise<ComponentHealth> {


        try {


            const price =

                await this.marketProvider
                    .getCurrentPrice();



            return ComponentHealth.healthy(

                "market",

                `Gold price available: ${price.gold18Price}`

            );


        }

        catch(error){


            return ComponentHealth.degraded(

                "market",

                error instanceof Error

                    ? error.message

                    : "Market unavailable"

            );


        }


    }



}