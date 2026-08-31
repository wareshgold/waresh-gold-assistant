import { ApplicationResponse }
from "../common/models/ApplicationResponse";

import { MarketPriceProvider }
from "../../domain/market/providers/MarketPriceProvider";

import { GetCurrentMarketPriceUseCase }
from "../market/GetCurrentMarketPriceUseCase";

import { faNumber, formatPrice } from "../../shared/utils/number";



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

            type:

                "text",



            content:

                [

                    "🟡 قیمت لحظه‌ای طلا",

                    "",

                    "💰 طلای ۱۸ عیار:",

                    `${this.formatToman(price.gold18Price)} تومان`,

                    "",

                    "💵 دلار:",

                    `${this.formatToman(price.currencyPrice)} تومان`,

                    "",

                    "🌎 انس جهانی:",

                    `${
                        price.ouncePrice !== null
                            ? this.formatOunce(price.ouncePrice)
                            : "ناموجود"
                    } دلار`,

                    "",

                    "🕒 بروزرسانی:",

                    price.updatedAt.toLocaleString(
                        "fa-IR",
                        {
                            timeZone:
                                "Asia/Tehran"
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

    private formatToman(
        value: number
    ): string {
        return formatPrice(value);
    }

    private formatOunce(
        value: number
    ): string {
        return faNumber(value, 2);
    }


}
