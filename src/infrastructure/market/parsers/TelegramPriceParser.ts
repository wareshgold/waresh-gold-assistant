export interface ParsedMarketPrice {

    gold18Price: number;

    currencyPrice: number;

    ouncePrice: number;

    updatedAt: Date;

}



export class TelegramPriceParser {


    static parse(
        message: string
    ): ParsedMarketPrice {


        const goldMatch =
            message.match(
                /طلای\s*۱۸\s*عیار:\s*([\d,]+)/m
            );


        const currencyMatch =
            message.match(
                /دلار\s*تهران:\s*([\d,]+)/m
            );


        const ounceMatch =
            message.match(
                /اونس\s*طلا:\s*([\d,]+)/m
            );



        if (
            !goldMatch ||
            !currencyMatch
        ) {

            throw new Error(
                "Invalid telegram price message"
            );

        }



        return {

            gold18Price:
                this.parseNumber(
                    goldMatch[1]
                ),


            currencyPrice:
                this.parseNumber(
                    currencyMatch[1]
                ),


            ouncePrice:
                ounceMatch
                    ? this.parseNumber(
                        ounceMatch[1]
                    )
                    : 1,


            updatedAt:
                new Date()

        };


    }





    private static parseNumber(
        value: string
    ): number {


        return Number(
            value.replace(/,/g, "")
        );


    }


}