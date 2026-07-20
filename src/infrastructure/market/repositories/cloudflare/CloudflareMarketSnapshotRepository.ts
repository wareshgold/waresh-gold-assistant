import { MarketSnapshotRepository } from "../../../../domain/market/repositories/MarketSnapshotRepository";
import { MarketSnapshot } from "../../../../domain/market/snapshots/MarketSnapshot";


export class CloudflareMarketSnapshotRepository
implements MarketSnapshotRepository {


    constructor(
        private readonly kv: KVNamespace
    ) {}



    private readonly historyKey =
        "market:snapshot:history";



    async save(
        snapshot: MarketSnapshot
    ): Promise<void> {


        const history =
            await this.getHistory();



        history.unshift(
            snapshot
        );



        const limitedHistory =
            history.slice(
                0,
                100
            );



        await this.kv.put(
            this.historyKey,
            JSON.stringify(
                limitedHistory
            )
        );


    }





    async getLatest():
        Promise<MarketSnapshot | null> {


        const history =
            await this.getHistory();



        return history.length > 0
            ? history[0]
            : null;


    }





    async getHistory(
        limit?: number
    ):
        Promise<MarketSnapshot[]> {


        const data =
            await this.kv.get(
                this.historyKey,
                "json"
            );



        if (!data) {

            return [];

        }



        const history =
            data as Array<any>;



        const snapshots =
            history.map(
                item =>
                    new MarketSnapshot(

                        item.gold18Price,

                        item.currencyPrice,

                        item.ouncePrice,

                        new Date(
                            item.capturedAt
                        ),

                        item.source ?? "unknown"

                    )
            );



        return limit
            ? snapshots.slice(
                0,
                limit
            )
            : snapshots;


    }


}