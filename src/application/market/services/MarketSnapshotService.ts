import { MarketPriceProvider } from "../../../domain/market/providers/MarketPriceProvider";
import { MarketSnapshot } from "../../../domain/market/snapshots/MarketSnapshot";
import { MarketSnapshotRepository } from "../../../domain/market/repositories/MarketSnapshotRepository";
import { MarketPrice } from "../../../domain/market/entities/MarketPrice";


export class MarketSnapshotService {


    private readonly priceProvider?:
        MarketPriceProvider;



    private readonly repository:
        MarketSnapshotRepository;



    constructor(
        repository:
            MarketSnapshotRepository,

        priceProvider?:
            MarketPriceProvider
    ) {

        this.repository =
            repository;


        this.priceProvider =
            priceProvider;

    }





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



        await this.repository.save(
            snapshot
        );



        return snapshot;

    }





    async capture():
        Promise<MarketSnapshot> {


        if (!this.priceProvider) {

            throw new Error(
                "MarketPriceProvider is required for capture"
            );

        }


        const price =
            await this.priceProvider
                .getCurrentPrice();



        return this.savePrice(
            price,
            "market-provider"
        );

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


}