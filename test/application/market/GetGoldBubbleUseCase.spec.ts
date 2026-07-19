import { describe, it, expect } from "vitest";

import { GetGoldBubbleUseCase } 
from "../../../src/application/market/GetGoldBubbleUseCase";

import { GoldBubbleCalculator }
from "../../../src/domain/market/services/GoldBubbleCalculator";

import { MarketPriceProvider }
from "../../../src/domain/market/providers/MarketPriceProvider";

import { MarketPrice }
from "../../../src/domain/market/entities/MarketPrice";


class FakeMarketPriceProvider
implements MarketPriceProvider {


    async getCurrentPrice(): Promise<MarketPrice> {

        return new MarketPrice(

            18_500_000,

            180_000,

            3_300,

            new Date()

        );

    }

}



describe(
    "GetGoldBubbleUseCase",
    () => {


        it(
            "should calculate gold bubble successfully",
            async () => {


                const provider =
                    new FakeMarketPriceProvider();



                const calculator =
                    new GoldBubbleCalculator();



                const useCase =
                    new GetGoldBubbleUseCase(
                        provider,
                        calculator
                    );



                const result =
                    await useCase.execute();



                expect(result.type)
                    .toBe("text");



                expect(result.metadata)
                    .toBeDefined();



                expect(
                    result.metadata?.marketPrice
                )
                    .toBe(18_500_000);



                expect(
                    result.metadata?.bubbleAmount
                )
                    .toBeDefined();



                expect(
                    result.metadata?.bubblePercentage
                )
                    .toBeDefined();


            }
        );


    }
);