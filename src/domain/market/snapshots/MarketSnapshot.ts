export class MarketSnapshot {


    constructor(

        public readonly gold18Price: number,

        public readonly currencyPrice: number,

        public readonly ouncePrice: number | null,

        public readonly capturedAt: Date,

        public readonly source: string

    ) {



        if (gold18Price <= 0) {

            throw new Error(
                "Snapshot gold price must be positive"
            );

        }



        if (currencyPrice <= 0) {

            throw new Error(
                "Snapshot currency price must be positive"
            );

        }



        if (
            ouncePrice !== null &&
            ouncePrice <= 0
        ) {

            throw new Error(
                "Snapshot ounce price must be positive"
            );

        }


    }





    static fromMarketPrice(

        price: {

            gold18Price: number;

            currencyPrice: number;

            ouncePrice: number | null;

            updatedAt: Date;

        },

        source: string = "unknown"

    ): MarketSnapshot {


        return new MarketSnapshot(

            price.gold18Price,

            price.currencyPrice,

            price.ouncePrice,

            price.updatedAt,

            source

        );


    }


}