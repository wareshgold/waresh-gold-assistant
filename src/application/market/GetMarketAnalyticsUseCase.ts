import { MarketAnalyticsFacade }
from "./services/MarketAnalyticsFacade";


import { MarketAnalytics }
from "../../domain/market/analytics/entities/MarketAnalytics";


import { MarketScore }
from "../../domain/market/analytics/value-objects/MarketScore";





export interface GetMarketAnalyticsOutput {


    analytics:
        MarketAnalytics | null;



    score:
        MarketScore | null;


}








export class GetMarketAnalyticsUseCase {





    constructor(


        private readonly facade:
            MarketAnalyticsFacade



    ) {}









    async execute():

        Promise<GetMarketAnalyticsOutput> {




        const result =

            await this.facade
                .analyze();







        if (!result) {


            return {


                analytics:
                    null,


                score:
                    null



            };


        }








        return {


            analytics:

                result.analytics,



            score:

                result.score



        };



    }






}