import { describe, expect, it } from "vitest";

import { D1MarketSnapshotRepository }
from "../../../src/infrastructure/market/repositories/d1/D1MarketSnapshotRepository";

import { MarketSnapshot }
from "../../../src/domain/market/snapshots/MarketSnapshot";



class FakeD1Database {


    private rows: any[] = [];



    prepare(
        query: string
    ) {


        const executeInsert = async (
            values: any[]
        ) => {


            if (
                query.includes("INSERT INTO")
            ) {


                this.rows.push({

                    gold18_price: values[0],

                    currency_price: values[1],

                    ounce_price: values[2],

                    source: values[3],

                    captured_at: values[4],

                    created_at: values[5]

                });


            }


        };





        const getSortedRows = () => {


            return this.rows.sort(

                (a,b)=>

                    new Date(b.captured_at).getTime()
                    -
                    new Date(a.captured_at).getTime()

            );


        };





        return {


            bind: (...values: any[]) => {


                return {


                    run: async () => {


                        await executeInsert(
                            values
                        );


                    },



                    all: async () => {


                        return {


                            results:
                                getSortedRows()


                        };


                    }



                };


            },



            first: async () => {


                return getSortedRows()[0] ?? null;


            }



        };


    }


}





describe(
    "D1MarketSnapshotRepository",
    ()=>{


        it(
            "should save and retrieve latest snapshot",
            async()=>{


                const db =
                    new FakeD1Database();



                const repository =
                    new D1MarketSnapshotRepository(

                        db as unknown as D1Database

                    );



                await repository.save(

                    new MarketSnapshot(

                        18780155,

                        193190,

                        4018,

                        new Date(),

                        "Qeymategold"

                    )

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
            "should return market history",
            async()=>{


                const db =
                    new FakeD1Database();



                const repository =
                    new D1MarketSnapshotRepository(

                        db as unknown as D1Database

                    );



                await repository.save(

                    new MarketSnapshot(

                        18000000,

                        190000,

                        4000,

                        new Date("2026-07-20"),

                        "source-1"

                    )

                );



                await repository.save(

                    new MarketSnapshot(

                        18780155,

                        193190,

                        4018,

                        new Date("2026-07-21"),

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