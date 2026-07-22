import { MarketPriceProvider }
from "../../../domain/market/providers/MarketPriceProvider";

import { GoldBubbleCalculator }
from "../../../domain/market/services/GoldBubbleCalculator";

import { MarketAnalyticsService }
from "./MarketAnalyticsService";

import { MarketIntelligenceCalculator }
from "../../../domain/market/intelligence/services/MarketIntelligenceCalculator";

import { MarketIntelligence }
from "../../../domain/market/intelligence/entities/MarketIntelligence";





export class MarketIntelligenceService {





    constructor(


        private readonly marketPriceProvider:
            MarketPriceProvider,


        private readonly bubbleCalculator:
            GoldBubbleCalculator,


        private readonly analyticsService:
            MarketAnalyticsService,


        private readonly intelligenceCalculator:
            MarketIntelligenceCalculator



    ) {}








    async analyze():

        Promise<MarketIntelligence | null> {





        const analytics =

            await this.analyticsService
                .analyze();





        if (!analytics) {


            return null;


        }







        const marketPrice =

            await this.marketPriceProvider
                .getCurrentPrice();








        const bubble =

            this.bubbleCalculator
                .calculate(

                    marketPrice

                );







        return this.intelligenceCalculator
            .calculate(

                analytics,

                bubble

            );



    }





}