import { MarketAnalytics }
from "../../analytics/entities/MarketAnalytics";

import { GoldBubbleResult }
from "../../services/GoldBubbleCalculator";

import { MarketIntelligence }
from "../entities/MarketIntelligence";

import { MarketRiskLevel }
from "../value-objects/MarketRiskLevel";

import { BubbleStatus }
from "../value-objects/BubbleStatus";

import { MarketSignal }
from "../value-objects/MarketSignal";





export class MarketIntelligenceCalculator {





    calculate(

        analytics: MarketAnalytics,

        bubble: GoldBubbleResult

    ):

        MarketIntelligence {



        const riskScore =

            this.calculateRiskScore(

                analytics,

                bubble

            );




        const riskLevel =

            this.resolveRiskLevel(

                riskScore

            );




        const bubbleStatus =

            BubbleStatus.fromPercentage(

                bubble.bubblePercentage

            );




        const signal =

            this.calculateSignal(

                analytics,

                bubbleStatus

            );





        return new MarketIntelligence(

            riskLevel,

            bubbleStatus,

            signal,

            new Date()

        );


    }







    private calculateRiskScore(

        analytics: MarketAnalytics,

        bubble: GoldBubbleResult

    ):

        number {



        let score = 0;



        const volatility =

            analytics.getVolatility();



        if (volatility >= 3) {

            score += 2;

        }

        else if (volatility >= 1) {

            score += 1;

        }





        if (bubble.bubblePercentage >= 5) {

            score += 2;

        }

        else if (bubble.bubblePercentage >= 2) {

            score += 1;

        }





        if (

            analytics.getTrend().isUp ||

            analytics.getTrend().isDown

        ) {

            score += 1;

        }





        return score;


    }







    private resolveRiskLevel(

        score: number

    ):

        MarketRiskLevel {



        if (score >= 4) {

            return MarketRiskLevel.high();

        }



        if (score >= 2) {

            return MarketRiskLevel.medium();

        }



        return MarketRiskLevel.low();


    }







    private calculateSignal(

        analytics: MarketAnalytics,

        bubbleStatus: BubbleStatus

    ):

        MarketSignal {



        if (

            analytics.getTrend().isUp &&

            bubbleStatus.isNormal

        ) {

            return MarketSignal.buyPressure();

        }




        if (

            analytics.getTrend().isDown

        ) {

            return MarketSignal.sellPressure();

        }




        return MarketSignal.wait();


    }


}