import { describe, expect, it, vi } from "vitest";

import {
    CompositeMarketPriceProvider
}
from "./CompositeMarketPriceProvider";

import {
    MarketPriceSource
}
from "../../../domain/market/providers/MarketPriceSource";

import {
    RetryPolicy
}
from "../../shared/retry/RetryPolicy";



describe("CompositeMarketPriceProvider", () => {



    it("should return price from first available source", async () => {



        const firstSource:
            MarketPriceSource = {


                async getPrice() {


                    return {


                        gold18Price: 18000000,

                        currencyPrice: 190000,

                        ouncePrice: 3300,

                        updatedAt: new Date()


                    };


                }


            };



        const secondSource:
            MarketPriceSource = {


                async getPrice() {


                    throw new Error(
                        "should not execute"
                    );


                }


            };



        const provider =
            new CompositeMarketPriceProvider([

                firstSource,

                secondSource

            ]);



        const result =
            await provider.getCurrentPrice();



        expect(result.gold18Price)
            .toBe(18000000);


    });






    it("should fallback when first source fails after retry", async () => {



        const failedSource:
            MarketPriceSource = {


                async getPrice() {


                    throw new Error(
                        "source failed"
                    );


                }


            };



        const workingSource:
            MarketPriceSource = {


                async getPrice() {


                    return {


                        gold18Price: 18500000,

                        currencyPrice: 191000,

                        ouncePrice: 3350,

                        updatedAt: new Date()


                    };


                }


            };



        const provider =

            new CompositeMarketPriceProvider(

                [

                    failedSource,

                    workingSource

                ],

                new RetryPolicy({

                    retries: 2,

                    delayMs: 0

                })

            );



        const result =

            await provider.getCurrentPrice();



        expect(result.gold18Price)
            .toBe(18500000);


    });






    it("should retry failed source before fallback", async () => {



        const getPrice =
            vi.fn()
                .mockRejectedValueOnce(
                    new Error("temporary failure")
                )
                .mockResolvedValue({

                    gold18Price: 18600000,

                    currencyPrice: 192000,

                    ouncePrice: 3360,

                    updatedAt: new Date()

                });



        const source:
            MarketPriceSource = {


                getPrice


            };



        const provider =

            new CompositeMarketPriceProvider(

                [

                    source

                ],

                new RetryPolicy({

                    retries: 1,

                    delayMs: 0

                })

            );



        const result =

            await provider.getCurrentPrice();



        expect(getPrice)
            .toHaveBeenCalledTimes(2);



        expect(result.gold18Price)
            .toBe(18600000);


    });






    it("should throw error when all sources fail", async () => {



        const failedSource:
            MarketPriceSource = {


                async getPrice() {


                    throw new Error(
                        "failed"
                    );


                }


            };



        const provider =

            new CompositeMarketPriceProvider(

                [

                    failedSource

                ],

                new RetryPolicy({

                    retries: 1,

                    delayMs: 0

                })

            );



        await expect(

            provider.getCurrentPrice()

        )
        .rejects
        .toThrow(

            "No market price source available"

        );


    });



});