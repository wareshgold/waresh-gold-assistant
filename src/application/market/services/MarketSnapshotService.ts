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




        const latest =
            await this.repository.getLatest();




        if (

            latest &&

            this.isDuplicate(

                latest,

                snapshot

            )

        ) {


            return latest;


        }





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









    private isDuplicate(

        previous:
            MarketSnapshot,

        current:
            MarketSnapshot

    ):

        boolean {



        const samePrice =


            previous.gold18Price ===
                current.gold18Price


            &&


            previous.currencyPrice ===
                current.currencyPrice


            &&


            previous.ouncePrice ===
                current.ouncePrice;



        if (!samePrice) {


            return false;

        }




        const timeDifference =


            Math.abs(

                current.capturedAt.getTime()

                -

                previous.capturedAt.getTime()

            );




        return (

            timeDifference <

            5 * 60 * 1000

        );


    }



}