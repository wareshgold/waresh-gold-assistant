import { MarketPrice }
from "../../../domain/market/entities/MarketPrice";


import { MarketPriceProvider }
from "../../../domain/market/providers/MarketPriceProvider";


import { CacheStore }
from "../../cache/CacheStore";


import { MarketSnapshotRepository }
from "../../../domain/market/repositories/MarketSnapshotRepository";


import { MetricRecorder }
from "../../../application/system/observability/MetricRecorder";


import { MetricType }
from "../../../domain/system/observability/MetricType";



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
            MarketSnapshotRepository,


        private readonly metrics?:
            MetricRecorder


    ) {}






    private async recordMetric(

        type:
            MetricType,

        value:
            number

    ): Promise<void> {


        if(this.metrics) {

            await this.metrics.record(

                type,

                value

            );

        }


    }









    async getCurrentPrice():

    Promise<MarketPrice> {



        let cached:

            MarketPrice | null = null;



        try {


            cached =

                await this.cache.get<MarketPrice>(

                    this.cacheKey

                );



        }

        catch(error) {



            await this.recordMetric(

                MetricType.CACHE_ERROR,

                1

            );


        }






        if(cached) {



            await this.recordMetric(

                MetricType.CACHE_HIT,

                1

            );



            return {


                ...cached,


                updatedAt:

                    new Date(

                        cached.updatedAt

                    )


            };


        }







        await this.recordMetric(

            MetricType.CACHE_MISS,

            1

        );







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

        catch(error) {



            console.warn(

                "Fresh market price failed, trying snapshot fallback"

            );







            const snapshot =


                await this.snapshotRepository

                    .getLatest();






            if(snapshot) {



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