import { MarketSnapshotRepository }
from "../../../domain/market/repositories/MarketSnapshotRepository";

import { MarketAnalytics }
from "../../../domain/market/analytics/entities/MarketAnalytics";

import { PercentageChange }
from "../../../domain/market/analytics/value-objects/PercentageChange";

import { TrendCalculator }
from "../../../domain/market/analytics/services/TrendCalculator";

import { VolatilityCalculator }
from "../../../domain/market/analytics/services/VolatilityCalculator";



export class MarketAnalyticsService {



    constructor(

        private readonly repository:
            MarketSnapshotRepository,


        private readonly trendCalculator:
            TrendCalculator,


        private readonly volatilityCalculator:
            VolatilityCalculator

    ) {}





    async analyze():

        Promise<MarketAnalytics | null> {



        const snapshots =

            await this.repository
                .getHistory(50);





        if (

            snapshots.length < 2

        ) {

            return null;

        }





        const latest =

            snapshots[0];



        const previous =

            snapshots[1];





        const change =

            PercentageChange.create(

                previous.gold18Price,

                latest.gold18Price

            );





        const trend =

            this.trendCalculator.calculate(

                latest.gold18Price,

                previous.gold18Price

            );





        const prices =

            snapshots.map(

                snapshot =>

                    snapshot.gold18Price

            );





        const volatility =

            this.volatilityCalculator.calculate(

                prices

            );





        return new MarketAnalytics(

            latest.gold18Price,

            previous.gold18Price,

            change,

            trend,

            volatility,

            new Date()

        );


    }


}