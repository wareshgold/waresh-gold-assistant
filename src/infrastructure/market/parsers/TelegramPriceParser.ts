import {
    MarketPrice
}
from "../../../domain/market/entities/MarketPrice";



export class TelegramPriceParser {



    static parse(
        message: string
    ): MarketPrice {


        const normalized =
            this.normalizeDigits(message);



        const gold18Price =
            this.extractNumber(
                normalized,
                /(?:طلای\s*18\s*عیار|طلای\s*۱۸\s*عیار|۱۸\s*عیار)\s*[:：]\s*([\d,]+)/i
            );



        const currencyPrice =
            this.extractNumber(
                normalized,
                /(?:دلار\s*تهران|دلار)\s*[:：]\s*([\d,]+)/i
            );



        const ouncePrice =
            this.extractNumber(
                normalized,
                /(?:اونس\s*طلا|اونس|انس\s*طلا)\s*[:：]\s*([\d,]+)/i
            );



        if (
            gold18Price === null ||
            currencyPrice === null
        ) {

            throw new Error(
                "Invalid telegram price message"
            );

        }



        return new MarketPrice(

            gold18Price,

            currencyPrice,

            ouncePrice,

            this.extractDateTime(normalized)

        );

    }





    private static extractNumber(
        text: string,
        regex: RegExp
    ): number | null {


        const match =
            text.match(regex);



        if (!match) {

            return null;

        }



        return Number(
            match[1]
                .replace(/,/g, "")
        );

    }





    private static normalizeDigits(
        value: string
    ): string {


        return value

            .replace(
                /[۰-۹]/g,
                digit =>
                    String(
                        "۰۱۲۳۴۵۶۷۸۹"
                            .indexOf(digit)
                    )
            )

            .replace(
                /[٬]/g,
                ","
            );

    }





    private static extractDateTime(
        text: string
    ): Date {


        const timeMatch =
            text.match(
                /ساعت\s*[:：]\s*(\d{1,2}):(\d{1,2})/
            );



        if (!timeMatch) {

            return new Date();

        }



        const date =
            new Date();



        date.setUTCHours(

            Number(timeMatch[1]),

            Number(timeMatch[2]),

            0,

            0

        );



        return date;

    }


}