import { ApplicationResponse }
from "../common/models/ApplicationResponse";

import { MarketPriceProvider }
from "../../domain/market/providers/MarketPriceProvider";

import { GetCurrentMarketPriceUseCase }
from "../market/GetCurrentMarketPriceUseCase";



export class GetGoldPriceUseCase {



    constructor(

        private readonly priceSource:

            MarketPriceProvider
            |
            GetCurrentMarketPriceUseCase

    ) {}





    async execute():

        Promise<ApplicationResponse> {



        const price =

            "execute" in this.priceSource

                ? await this.priceSource.execute()

                : await this.priceSource.getCurrentPrice();






        return {


            type: "text",


            content:

                [

                    "🟡 قیمت لحظه‌ای طلا",

                    "",

                    "💰 طلای ۱۸ عیار:",

                    `${this.copyFormat(price.gold18Price)} تومان`,

                    "",

                    "💵 دلار:",

                    `${this.copyFormat(price.currencyPrice)} تومان`,

                    "",

                    "🌎 اونس جهانی:",

                    `${
                        price.ouncePrice !== null
                            ? this.copyFormat(price.ouncePrice)
                            : "ناموجود"
                    } دلار`,

                    "",

                    "🕒 بروزرسانی:",

                    price.updatedAt.toLocaleString(

                        "fa-IR",

                        {
                            timeZone: "Asia/Tehran"
                        }

                    )

                ].join("\n"),





            metadata: {


                gold18Price:

                    price.gold18Price,


                currencyPrice:

                    price.currencyPrice,


                ouncePrice:

                    price.ouncePrice,


                updatedAt:

                    price.updatedAt


            }


        };


    }






    private copyFormat(

        value: number

    ): string {


        return `\`${this.formatNumber(value)}\``;


    }







    private formatNumber(

        value: number

    ): string {


        return new Intl.NumberFormat(

            "fa-IR"

        ).format(

            Math.round(value)

        );


    }


}