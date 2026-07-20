import { describe, expect, it } from "vitest";

import { CloudflareMarketSnapshotRepository }
from "../../../src/infrastructure/market/repositories/cloudflare/CloudflareMarketSnapshotRepository";

import { MarketSnapshot }
from "../../../src/domain/market/snapshots/MarketSnapshot";



class FakeKVNamespace {


    private storage =
        new Map<string, string>();



    async put(
        key: string,
        value: string
    ) {

        this.storage.set(
            key,
            value
        );

    }



    async get(
        key: string,
        type?: "json"
    ) {


        const value =
            this.storage.get(
                key
            );


        if (!value) {

            return null;

        }



        if (type === "json") {

            return JSON.parse(
                value
            );

        }



        return value;

    }


}




describe(
    "CloudflareMarketSnapshotRepository",
    ()=>{


        it(
            "should save and retrieve latest snapshot",
            async()=>{


                const kv =
                    new FakeKVNamespace();



                const repository =
                    new CloudflareMarketSnapshotRepository(
                        kv as unknown as KVNamespace
                    );



                const snapshot =
                    new MarketSnapshot(

                        18780155,

                        193190,

                        4018,

                        new Date(),

                        "Qeymategold"

                    );



                await repository.save(
                    snapshot
                );



                const latest =
                    await repository.getLatest();



                expect(latest)
                    .not
                    .toBeNull();



                expect(
                    latest?.gold18Price
                )
                .toBe(
                    18780155
                );



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


                const kv =
                    new FakeKVNamespace();



                const repository =
                    new CloudflareMarketSnapshotRepository(
                        kv as unknown as KVNamespace
                    );



                await repository.save(

                    new MarketSnapshot(

                        18000000,

                        190000,

                        4000,

                        new Date(),

                        "source-1"

                    )

                );



                await repository.save(

                    new MarketSnapshot(

                        18780155,

                        193190,

                        4018,

                        new Date(),

                        "source-2"

                    )

                );



                const history =
                    await repository.getHistory();



                expect(
                    history.length
                )
                .toBe(
                    2
                );



                expect(
                    history[0].source
                )
                .toBe(
                    "source-2"
                );


            }
        );


    }
);