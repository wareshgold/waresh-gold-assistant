import { MarketSnapshotService }
from "./services/MarketSnapshotService";


import { MarketSnapshot }
from "../../domain/market/snapshots/MarketSnapshot";



export interface GetMarketChartOutput {


    items:
        MarketSnapshot[];


}





export class GetMarketChartUseCase {



    constructor(

        private readonly service:
            MarketSnapshotService

    ) {}







    async execute(

        limit: number = 48

    ):
        Promise<GetMarketChartOutput> {



        const history =

            await this.service
                .getHistory(limit);





        return {


            items:

                history
                    .reverse()


        };


    }


}