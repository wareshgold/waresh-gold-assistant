import { MarketSnapshot }
from "../../../../domain/market/snapshots/MarketSnapshot";

import { MarketSnapshotRepository }
from "../../../../domain/market/repositories/MarketSnapshotRepository";



export class D1MarketSnapshotRepository
implements MarketSnapshotRepository {


    constructor(
        private readonly db: D1Database
    ) {}




    async save(
        snapshot: MarketSnapshot
    ): Promise<void> {


        await this.db
            .prepare(
                `
                INSERT INTO market_snapshots
                (
                    gold18_price,
                    currency_price,
                    ounce_price,
                    source,
                    captured_at,
                    created_at
                )

                VALUES
                (?, ?, ?, ?, ?, ?)
                `
            )
            .bind(

                snapshot.gold18Price,

                snapshot.currencyPrice,

                snapshot.ouncePrice,

                snapshot.source,

                snapshot.capturedAt.toISOString(),

                new Date().toISOString()

            )
            .run();


    }







    async getLatest():
        Promise<MarketSnapshot | null> {


        const result =
            await this.db
                .prepare(
                    `
                    SELECT *

                    FROM market_snapshots

                    ORDER BY captured_at DESC

                    LIMIT 1
                    `
                )
                .first<any>();



        if (!result) {

            return null;

        }



        return this.mapRow(result);


    }








    async getHistory(
        limit: number = 50
    ):
        Promise<MarketSnapshot[]> {


        const result =
            await this.db
                .prepare(
                    `
                    SELECT *

                    FROM market_snapshots

                    ORDER BY captured_at DESC

                    LIMIT ?
                    `
                )
                .bind(limit)
                .all<any>();



        return (

            result.results ?? []

        )
        .map(

            row => this.mapRow(row)

        );


    }








    private mapRow(
        row: any
    ): MarketSnapshot {


        return new MarketSnapshot(

            Number(row.gold18_price),

            Number(row.currency_price),

            Number(row.ounce_price),

            new Date(
                row.captured_at
            ),

            row.source ?? "unknown"

        );


    }


}