import {
    MarketPriceSource,
    MarketPriceResult
}
from "../../../domain/market/providers/MarketPriceSource";

import {
    MarketMessageProvider
}
from "../sources/MarketMessageProvider";

import {
    TelegramPriceParser
}
from "../parsers/TelegramPriceParser";



export class TelegramChannelCollector
implements MarketPriceSource {



    constructor(

        private readonly messageProvider:
            MarketMessageProvider

    ) {}





    async getPrice():
        Promise<MarketPriceResult> {



        const message =

            await this.messageProvider
                .getLatestMessage();





        const parsed =

            TelegramPriceParser.parse(
                message
            );





        return {


            gold18Price:

                parsed.gold18Price,



            currencyPrice:

                parsed.currencyPrice,



            ouncePrice:

                parsed.ouncePrice,



            updatedAt:

                parsed.updatedAt


        };


    }


}