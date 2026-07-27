import { MarketAnalytics }
from "../entities/MarketAnalytics";

import { MarketScore }
from "../value-objects/MarketScore";




export class MarketScoreCalculator {




    calculate(

        analytics:
            MarketAnalytics

    ):

        MarketScore {


        let score = 50;





        const trend =

            analytics.getTrend();





        if (trend.isUp) {

            score += 20;

        }


        else if (trend.isDown) {

            score -= 20;

        }





        const volatility =

            analytics.getVolatility();





        if (volatility < 1) {

            score += 10;

        }


        else if (volatility > 3) {

            score -= 15;

        }





        const change =

            analytics
                .getChange()
                .value;





        if (change > 2) {

            score += 10;

        }


        else if (change < -2) {

            score -= 10;

        }





        return MarketScore.create(

            Math.max(

                0,

                Math.min(

                    100,

                    score

                )

            )

        );


    }





}