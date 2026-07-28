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



        const dateMatch =
            text.match(
                /تاریخ\s*:\s*(\d{4})\/(\d{1,2})\/(\d{1,2})/
            );



        if (
            !timeMatch ||
            !dateMatch
        ) {

            return new Date();

        }



        const jalaliYear =
            Number(dateMatch[1]);

        const jalaliMonth =
            Number(dateMatch[2]);

        const jalaliDay =
            Number(dateMatch[3]);



        const gregorian =
            this.jalaliToGregorian(
                jalaliYear,
                jalaliMonth,
                jalaliDay
            );



        return new Date(

            Date.UTC(

                gregorian.year,

                gregorian.month - 1,

                gregorian.day,

                Number(timeMatch[1]) - 3,

                Number(timeMatch[2]) - 30,

                0

            )

        );

    }







    private static jalaliToGregorian(
        jy: number,
        jm: number,
        jd: number
    ) {


        jy += 1595;



        const days =
            -355668 +
            (365 * jy) +
            Math.floor(jy / 33) * 8 +
            Math.floor(((jy % 33) + 3) / 4) +
            jd +
            (
                jm < 7
                    ? (jm - 1) * 31
                    : ((jm - 7) * 30) + 186
            );



        let gy =
            400 *
            Math.floor(days / 146097);



        let day =
            days % 146097;



        if (day > 36524) {

            gy +=
                100 *
                Math.floor(--day / 36524);

            day =
                day % 36524;



            if (day >= 365) {

                day++;

            }

        }



        gy +=
            4 *
            Math.floor(day / 1461);



        day =
            day % 1461;



        if (day > 365) {

            gy +=
                Math.floor((day - 1) / 365);

            day =
                (day - 1) % 365;

        }



        let gm =
            0;



        const monthDays = [

            31,
            28,
            31,
            30,
            31,
            30,
            31,
            31,
            30,
            31,
            30,
            31

        ];



        while (

            gm < 12 &&
            day >= monthDays[gm]

        ) {

            day -= monthDays[gm];

            gm++;

        }



        return {

            year: gy,

            month: gm + 1,

            day: day + 1

        };

    }


}