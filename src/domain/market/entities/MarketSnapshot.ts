import { MarketPrice } from "./MarketPrice";


export class MarketSnapshot {


    constructor(

        public readonly price: MarketPrice,

        public readonly source: string,

        public readonly receivedAt: Date

    ) {



        if (!source || source.trim().length === 0) {

            throw new Error(
                "Market snapshot source is required"
            );

        }



    }



    get gold18Price(): number {

        return this.price.gold18Price;

    }



    get currencyPrice(): number {

        return this.price.currencyPrice;

    }



    get ouncePrice(): number {

        return this.price.ouncePrice;

    }



}