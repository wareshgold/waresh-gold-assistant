import { ApplicationResponse }
from "../common/models/ApplicationResponse";

import { MarketPriceProvider }
from "../../domain/market/providers/MarketPriceProvider";

import { GoldBubbleCalculator }
from "../../domain/market/services/GoldBubbleCalculator";



export class GetGoldBubbleUseCase {



    constructor(

        private readonly marketPriceProvider:
            MarketPriceProvider,


        private readonly calculator:
            GoldBubbleCalculator

    ) {}





    async execute(): Promise<ApplicationResponse> {



        const marketPrice =

            await this.marketPriceProvider
                .getCurrentPrice();





        const result =

            this.calculator.calculate(

                marketPrice

            );





        return {



            type: "text",




            content:

                [

                    "🟡 حباب طلا",

                    "",

                    "💰 قیمت بازار:",

                    `${this.formatNumber(result.marketPrice)} تومان`,

                    "",

                    "🏦 قیمت ذاتی:",

                    `${this.formatNumber(result.intrinsicPrice)} تومان`,

                    "",

                    "🫧 مقدار حباب:",

                    `${this.formatNumber(result.bubbleAmount)} تومان`,

                    "",

                    "📊 درصد حباب:",

                    `${this.formatPercent(result.bubblePercentage)}`

                ].join("\n"),





            metadata: {



                marketPrice:

                    result.marketPrice,



                intrinsicPrice:

                    result.intrinsicPrice,



                bubbleAmount:

                    result.bubbleAmount,



                bubblePercentage:

                    result.bubblePercentage



            }


        };


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





    private formatPercent(

        value: number

    ): string {


        return (

            new Intl.NumberFormat(

                "fa-IR",

                {

                    minimumFractionDigits: 2,

                    maximumFractionDigits: 2

                }

            )

            .format(value)

            +

            "٪"

        );


    }


}