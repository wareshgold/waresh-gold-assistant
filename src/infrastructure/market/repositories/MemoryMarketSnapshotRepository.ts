import { MarketSnapshot } 
from "../../../domain/market/entities/MarketSnapshot";

import { MarketSnapshotRepository }
from "../../../domain/market/repositories/MarketSnapshotRepository";



export class MemoryMarketSnapshotRepository
implements MarketSnapshotRepository {



    private readonly snapshots:
        MarketSnapshot[] = [];




    async save(
        snapshot: MarketSnapshot
    ): Promise<void> {


        this.snapshots.push(
            snapshot
        );


    }





    async getLatest():
        Promise<MarketSnapshot | null> {


        if (
            this.snapshots.length === 0
        ) {

            return null;

        }



        return this.snapshots[
            this.snapshots.length - 1
        ];


    }





    async getHistory(
        limit: number = 10
    ):
        Promise<MarketSnapshot[]> {


        return this.snapshots
            .slice(-limit)
            .reverse();


    }



}