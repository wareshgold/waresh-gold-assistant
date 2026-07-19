import { MarketSnapshot } from "../entities/MarketSnapshot";


export interface MarketSnapshotRepository {


    save(
        snapshot: MarketSnapshot
    ): Promise<void>;



    getLatest():
        Promise<MarketSnapshot | null>;



    getHistory(
        limit?: number
    ):
        Promise<MarketSnapshot[]>;


}