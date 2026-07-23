import { MarketPrice }
from "../../../domain/market/entities/MarketPrice";

import { MarketPriceProvider }
from "../../../domain/market/providers/MarketPriceProvider";

import { CacheStore }
from "../../cache/CacheStore";

import { MarketSnapshotRepository }
from "../../../domain/market/repositories/MarketSnapshotRepository";



export class CachedMarketPriceProvider
implements MarketPriceProvider {



    private readonly cacheKey =
        "market:current-price";



    constructor(

        private readonly fallbackProvider:
            MarketPriceProvider,


        private readonly cache:
            CacheStore,


        private readonly snapshotRepository:
            MarketSnapshotRepository

    ) {}





    async getCurrentPrice():
        Promise<MarketPrice> {



        const cached =

            await this.cache.get<MarketPrice>(

                this.cacheKey

            );



        if (cached) {


            return {

                ...cached,


                updatedAt:

                    new Date(

                        cached.updatedAt

                    )

            };


        }





        try {


            console.warn(

                "Market cache empty, requesting fresh price"

            );


            const freshPrice =

                await this.fallbackProvider

                    .getCurrentPrice();



            await this.cache.set(

                this.cacheKey,

                freshPrice,

                1800

            );



            return freshPrice;



        }

        catch(error){



            console.warn(

                "Fresh market price failed, trying snapshot fallback"

            );



            const snapshot =

                await this.snapshotRepository

                    .getLatest();



            if(snapshot){



                console.warn(

                    "Using stale market snapshot"

                );



                return new MarketPrice(

                    snapshot.gold18Price,

                    snapshot.currencyPrice,

                    snapshot.ouncePrice,

                    snapshot.capturedAt

                );


            }



            throw error;



        }



    }


}