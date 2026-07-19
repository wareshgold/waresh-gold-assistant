import { MarketPrice } 
from "../../../domain/market/entities/MarketPrice";


import { MarketSnapshot }
from "../../../domain/market/entities/MarketSnapshot";


import { MarketSnapshotRepository }
from "../../../domain/market/repositories/MarketSnapshotRepository";



export class MarketSnapshotService {



    constructor(

        private readonly repository:
            MarketSnapshotRepository

    ) {}





    async savePrice(

        price: MarketPrice,

        source: string

    ): Promise<MarketSnapshot> {



        const snapshot =
            new MarketSnapshot(

                price,

                source,

                new Date()

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

    ): Promise<MarketSnapshot[]> {



        return this.repository
            .getHistory(
                limit
            );


    }



}