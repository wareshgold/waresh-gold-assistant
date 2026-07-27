import {
    MarketSnapshotRepository
}
from "../../../domain/market/repositories/MarketSnapshotRepository";


import {
    MarketChartPoint
}
from "./MarketChartPoint";





export class MarketChartService {




    constructor(

        private readonly repository:
            MarketSnapshotRepository

    ) {}







    async getChart(

        limit: number = 48

    ):
        Promise<MarketChartPoint[]> {




        const snapshots =

            await this.repository
                .getHistory(limit);






        return snapshots

            .reverse()

            .map(snapshot => ({



                capturedAt:

                    snapshot.capturedAt,



                gold18Price:

                    snapshot.gold18Price,



                currencyPrice:

                    snapshot.currencyPrice,



                ouncePrice:

                    snapshot.ouncePrice ?? null



            }));



    }






}