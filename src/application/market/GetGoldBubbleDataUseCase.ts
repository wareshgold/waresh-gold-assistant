import { MarketPriceProvider }
from "../../domain/market/providers/MarketPriceProvider";

import { GoldBubbleCalculator }
from "../../domain/market/services/GoldBubbleCalculator";



export interface GoldBubbleDataResponse {


    marketPrice:
        number;


    intrinsicPrice:
        number;


    bubbleAmount:
        number;


    bubblePercentage:
        number;


    updatedAt:
        Date;


}



export class GetGoldBubbleDataUseCase {



    constructor(


        private readonly marketPriceProvider:
            MarketPriceProvider,


        private readonly calculator:
            GoldBubbleCalculator


    ) {}





    async execute()
    : Promise<GoldBubbleDataResponse> {



        const marketPrice =

            await this.marketPriceProvider
                .getCurrentPrice();




        const result =

            this.calculator.calculate(

                marketPrice

            );




        return {


            marketPrice:
                result.marketPrice,


            intrinsicPrice:
                result.intrinsicPrice,


            bubbleAmount:
                result.bubbleAmount,


            bubblePercentage:
                result.bubblePercentage,


            updatedAt:
                marketPrice.updatedAt


        };


    }


}