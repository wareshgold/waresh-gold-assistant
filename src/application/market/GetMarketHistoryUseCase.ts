import { MarketSnapshotService }
from "./services/MarketSnapshotService";

import { MarketSnapshot }
from "../../domain/market/snapshots/MarketSnapshot";


export interface GetMarketHistoryOutput {

    items:
        MarketSnapshot[];

}



export class GetMarketHistoryUseCase {


    constructor(
        private readonly service:
            MarketSnapshotService
    ){}




    async execute(
        limit?: number
    ):
        Promise<GetMarketHistoryOutput> {


        const history =
            await this.service
                .getHistory(limit);



        return {

            items:
                history

        };


    }


}