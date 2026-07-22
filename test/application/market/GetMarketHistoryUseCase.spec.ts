import { describe, expect, it } from "vitest";

import { GetMarketHistoryUseCase }
from "../../../src/application/market/GetMarketHistoryUseCase";

import { MarketSnapshotService }
from "../../../src/application/market/services/MarketSnapshotService";

import { MemoryMarketSnapshotRepository }
from "../../../src/infrastructure/market/repositories/MemoryMarketSnapshotRepository";

import { MarketSnapshot }
from "../../../src/domain/market/snapshots/MarketSnapshot";



describe(
    "GetMarketHistoryUseCase",
    () => {


        it(
            "should return market snapshot history",
            async () => {


                const repository =
                    new MemoryMarketSnapshotRepository();



                const service =
                    new MarketSnapshotService(
                        repository
                    );



                const useCase =
                    new GetMarketHistoryUseCase(
                        service
                    );



                await repository.save(

                    new MarketSnapshot(

                        18000000,
                        190000,
                        4000,
                        new Date(
                            "2026-07-20T10:00:00Z"
                        ),
                        "test"

                    )

                );



                await repository.save(

                    new MarketSnapshot(

                        18100000,
                        191000,
                        4010,
                        new Date(
                            "2026-07-20T11:00:00Z"
                        ),
                        "test"

                    )

                );



                const result =
                    await useCase.execute();



                expect(
                    result.items.length
                )
                .toBe(2);



                expect(
                    result.items[0].gold18Price
                )
                .toBe(18100000);



                expect(
                    result.items[1].gold18Price
                )
                .toBe(18000000);


            }
        );





        it(
            "should respect history limit",
            async () => {


                const repository =
                    new MemoryMarketSnapshotRepository();



                const service =
                    new MarketSnapshotService(
                        repository
                    );



                const useCase =
                    new GetMarketHistoryUseCase(
                        service
                    );



                await repository.save(

                    new MarketSnapshot(
                        100,
                        10,
                        1,
                        new Date(),
                        "test"
                    )

                );


                await repository.save(

                    new MarketSnapshot(
                        200,
                        20,
                        2,
                        new Date(),
                        "test"
                    )

                );



                const result =
                    await useCase.execute(1);



                expect(
                    result.items.length
                )
                .toBe(1);



                expect(
                    result.items[0].gold18Price
                )
                .toBe(200);


            }
        );


    }
);