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
                /طلای\s*۱۸\s*عیار:\s*([0-9۰-۹٠-٩,]+)/m
            );



        const currencyMatch =
            message.match(
                /(?:دلار\s*تهران|تتر|دلار):\s*([0-9۰-۹٠-٩,]+)/m
            );



        const ounceMatch =
            message.match(
                /اونس\s*طلا:\s*([0-9۰-۹٠-٩,]+)/m
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
                    : 0,



            updatedAt:
                this.parseTelegramDateTime(
                    message
                )

        };


    }





    private static parseTelegramDateTime(
        message: string
    ): Date {



        const dateMatch =
            message.match(
                /(?:تاریخ|📅)\s*[:：]?\s*([0-9۰-۹٠-٩]{4})[\/\-]([0-9۰-۹٠-٩]{1,2})[\/\-]([0-9۰-۹٠-٩]{1,2})/
            );



        const timeMatch =
            message.match(
                /(?:ساعت|🕒|⏰)\s*[:：]?\s*([0-9۰-۹٠-٩]{1,2})[:：]([0-9۰-۹٠-٩]{1,2})/
            );



        if (!dateMatch) {

            return new Date();

        }



        const year =
            Number(
                this.convertPersianNumber(
                    dateMatch[1]
                )
            );



        const month =
            Number(
                this.convertPersianNumber(
                    dateMatch[2]
                )
            );



        const day =
            Number(
                this.convertPersianNumber(
                    dateMatch[3]
                )
            );



        const hour =
            timeMatch
                ? Number(
                    this.convertPersianNumber(
                        timeMatch[1]
                    )
                )
                : 0;



        const minute =
            timeMatch
                ? Number(
                    this.convertPersianNumber(
                        timeMatch[2]
                    )
                )
                : 0;



        const gregorian =
            this.jalaliToGregorian(
                year,
                month,
                day
            );



        return new Date(

            Date.UTC(

                gregorian.year,

                gregorian.month - 1,

                gregorian.day,

                hour,

                minute

            )

        );


    }





    private static jalaliToGregorian(
        jy: number,
        jm: number,
        jd: number
    ) {



        const date =
            new Date(
                Date.UTC(
                    jy + 621,
                    2,
                    21
                )
            );



        const days =
            jd +
            (
                jm <= 6

                    ? (jm - 1) * 31

                    : (jm - 7) * 30 + 186

            );



        date.setUTCDate(
            date.getUTCDate() + days - 1
        );



        return {

            year:
                date.getUTCFullYear(),

            month:
                date.getUTCMonth() + 1,

            day:
                date.getUTCDate()

        };


    }





    private static convertPersianNumber(
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
                /[٠-٩]/g,
                digit =>
                    String(
                        "٠١٢٣٤٥٦٧٨٩"
                        .indexOf(digit)
                    )
            );


    }





    private static parseNumber(
        value: string
    ): number {



        return Number(

            this.convertPersianNumber(
                value
            )
            .replace(
                /,/g,
                ""
            )

        );


    }


}