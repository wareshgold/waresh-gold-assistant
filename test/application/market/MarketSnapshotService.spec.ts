import { describe, expect, it } from "vitest";


import { MarketSnapshotService }
from "../../../src/application/market/services/MarketSnapshotService";


import { MemoryMarketSnapshotRepository }
from "../../../src/infrastructure/market/repositories/MemoryMarketSnapshotRepository";


import { MarketPrice }
from "../../../src/domain/market/entities/MarketPrice";



describe(
    "MarketSnapshotService",
    ()=>{


        it(
            "should save and retrieve market snapshot",
            async()=>{


                const repository =
                    new MemoryMarketSnapshotRepository();



                const service =
                    new MarketSnapshotService(
                        repository
                    );



                const price =
                    new MarketPrice(

                        18780155,

                        193190,

                        4018,

                        new Date()

                    );



                const snapshot =
                    await service.savePrice(

                        price,

                        "Qeymategold"

                    );



                expect(
                    snapshot.gold18Price
                )
                .toBe(
                    18780155
                );



                const latest =
                    await service.getLatest();



                expect(latest)
                    .not
                    .toBeNull();



                expect(
                    latest?.source
                )
                .toBe(
                    "Qeymategold"
                );



            }
        );




        it(
            "should return history list",
            async()=>{


                const repository =
                    new MemoryMarketSnapshotRepository();



                const service =
                    new MarketSnapshotService(
                        repository
                    );



                await service.savePrice(

                    new MarketPrice(
                        18000000,
                        190000,
                        4000,
                        new Date()
                    ),

                    "Qeymategold"

                );



                await service.savePrice(

                    new MarketPrice(
                        18780155,
                        193190,
                        4018,
                        new Date()
                    ),

                    "Qeymategold"

                );



                const history =
                    await service.getHistory();



                expect(history.length)
                    .toBe(2);



                expect(
                    history[0].gold18Price
                )
                .toBe(
                    18780155
                );


            }
        );


    }
);