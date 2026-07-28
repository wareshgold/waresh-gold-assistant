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



        console.log(
            "PARSER DEBUG:",
            normalized
                .replace(/\s+/g, " ")
                .trim()
        );



        const gold18Price =
            this.extractNumber(
                normalized,
                /طلای\s*18\s*عیار\s*:\s*([\d,]+)/i
            )
            ??
            this.extractNumber(
                normalized,
                /طلای\s*.*?18\s*.*?عیار.*?([\d,]+)/i
            );



        const currencyPrice =
            this.extractNumber(
                normalized,
                /دلار(?:\s*تهران)?\s*:\s*([\d,]+)/i
            )
            ??
            this.extractNumber(
                normalized,
                /تتر\s*:\s*([\d,]+)/i
            );



        const ouncePrice =
            this.extractNumber(
                normalized,
                /اونس\s*طلا\s*:\s*([\d,]+)(?:\$)?/i
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
                /٬/g,
                ","
            );

    }







    private static extractDateTime(
        text: string
    ): Date {


        const timeMatch =
            text.match(
                /ساعت\s*:\s*(\d{1,2}):(\d{1,2})/
            );



        if (!timeMatch) {

            return new Date();

        }



        const date =
            new Date();



        date.setHours(

            Number(timeMatch[1]),

            Number(timeMatch[2]),

            0,

            0

        );



        return date;

    }


}