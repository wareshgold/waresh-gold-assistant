import { MarketPrice } from "../entities/MarketPrice";


export interface GoldBubbleResult {


    intrinsicPrice: number;


    bubbleAmount: number;


    bubblePercentage: number;


    marketPrice: number;


}



export class GoldBubbleCalculator {



    calculate(

        marketPrice: MarketPrice

    ): GoldBubbleResult {



        const gram24kPrice =

            (
                marketPrice.ouncePrice *
                marketPrice.currencyPrice
            )
            /
            31.1;




        const intrinsicPrice =

            gram24kPrice * 0.75;




        const bubbleAmount =

            marketPrice.gold18Price -
            intrinsicPrice;




        const bubblePercentage =

            (
                bubbleAmount /
                intrinsicPrice
            )
            *
            100;




        return {


            intrinsicPrice,


            bubbleAmount,


            bubblePercentage,


            marketPrice:
                marketPrice.gold18Price


        };


    }


}