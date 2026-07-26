import {
    ApplicationResponse
}
from "../common/models/ApplicationResponse";


import {
    MarketPriceProvider
}
from "../../domain/market/providers/MarketPriceProvider";


import {
    GoldBubbleCalculator
}
from "../../domain/market/services/GoldBubbleCalculator";





export class GetGoldBubbleUseCase {





    constructor(


        private readonly marketPriceProvider:
            MarketPriceProvider,


        private readonly calculator:
            GoldBubbleCalculator


    ) {}









    async execute():

        Promise<ApplicationResponse> {



        const marketPrice =


            await this.marketPriceProvider

                .getCurrentPrice();








        const result =


            this.calculator.calculate(

                marketPrice

            );








        return {


            type:

                "data",



            content:

                "",



            data:

                result,



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



}