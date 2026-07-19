import { MarketPrice } from "../../../domain/market/entities/MarketPrice";
import { MarketPriceProvider } from "../../../domain/market/providers/MarketPriceProvider";

import { MarketMessageProvider } from "../sources/MarketMessageProvider";
import { TelegramPriceParser } from "../parsers/TelegramPriceParser";
import { MarketPriceMapper } from "../mappers/MarketPriceMapper";



export class TelegramMarketPriceProvider
implements MarketPriceProvider {



    constructor(

        private readonly messageProvider:
            MarketMessageProvider

    ) {}



    async getCurrentPrice():
        Promise<MarketPrice> {



        const message =
            await this.messageProvider
                .getLatestMessage();




        const parsed =
            TelegramPriceParser.parse(
                message
            );




        return MarketPriceMapper.toDomain(
            parsed
        );


    }


}