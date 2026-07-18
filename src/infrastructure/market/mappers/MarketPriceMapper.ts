import { MarketPrice } from "../../../domain/market/entities/MarketPrice";
import { RawMarketPrice } from "../clients/PriceSourceClient";


export class MarketPriceMapper {


    static toDomain(
        raw: RawMarketPrice
    ): MarketPrice {


        return new MarketPrice(
            raw.gold18Price,
            raw.currencyPrice,
            raw.updatedAt
        );

    }

}