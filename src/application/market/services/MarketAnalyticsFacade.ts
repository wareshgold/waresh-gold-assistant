import { MarketAnalyticsService }
from "./MarketAnalyticsService";


import { MarketScoreCalculator }
from "../../../domain/market/analytics/services/MarketScoreCalculator";


import { MarketAnalytics }
from "../../../domain/market/analytics/entities/MarketAnalytics";


import { MarketScore }
from "../../../domain/market/analytics/value-objects/MarketScore";





export interface MarketAnalyticsFacadeResult {


    analytics:
        MarketAnalytics;


    score:
        MarketScore;


}








export class MarketAnalyticsFacade {





    constructor(


        private readonly analyticsService:
            MarketAnalyticsService,


        private readonly scoreCalculator:
            MarketScoreCalculator



    ) {}









    async analyze():

        Promise<MarketAnalyticsFacadeResult | null> {




        const analytics =

            await this.analyticsService
                .analyze();







        if (!analytics) {


            return null;


        }








        const score =

            this.scoreCalculator
                .calculate(

                    analytics

                );








        return {


            analytics,


            score



        };



    }






}