import { MarketAnalyticsService }
from "./services/MarketAnalyticsService";

import { MarketAnalytics }
from "../../domain/market/analytics/entities/MarketAnalytics";



export interface GetMarketAnalyticsOutput {

    analytics:
        MarketAnalytics | null;

}





export class GetMarketAnalyticsUseCase {



    constructor(

        private readonly service:
            MarketAnalyticsService

    ) {}





    async execute():

        Promise<GetMarketAnalyticsOutput> {



        const analytics =

            await this.service
                .analyze();




        return {

            analytics

        };


    }


}