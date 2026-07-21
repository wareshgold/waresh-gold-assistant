import { MarketSnapshot } 
from "../../../domain/market/snapshots/MarketSnapshot";

import { MarketSnapshotRepository } 
from "../../../domain/market/repositories/MarketSnapshotRepository";

import { MarketPrice } 
from "../../../domain/market/entities/MarketPrice";



export class MarketSnapshotService {



    constructor(

        private readonly repository:
            MarketSnapshotRepository

    ) {}





    async savePrice(

        price: MarketPrice,

        source: string = "unknown"

    ):
        Promise<MarketSnapshot> {



        const snapshot =
            MarketSnapshot.fromMarketPrice(

                price,

                source

            );



        await this.repository.save(
            snapshot
        );



        return snapshot;

    }





    async getLatest():

        Promise<MarketSnapshot | null> {


        return this.repository
            .getLatest();

    }





    async getHistory(

        limit?: number

    ):
        Promise<MarketSnapshot[]> {


        return this.repository
            .getHistory(limit);

    }


}