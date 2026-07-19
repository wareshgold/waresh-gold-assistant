import { describe, expect, it } from "vitest";

import {
    CompositeMarketPriceProvider
}
from "../../../src/infrastructure/market/providers/CompositeMarketPriceProvider";



describe(
    "CompositeMarketPriceProvider",
    ()=>{


        it(
            "should use first available source",
            async()=>{


                const provider =
                    new CompositeMarketPriceProvider([


                        {

                            async getPrice(){

                                return {

                                    gold18Price:20000000,

                                    currencyPrice:200000,

                                    ouncePrice:4000,

                                    updatedAt:new Date()

                                };

                            }

                        }


                    ]);



                const price =
                    await provider.getCurrentPrice();



                expect(price.gold18Price)
                    .toBe(
                        20000000
                    );


            }
        );




        it(
            "should fallback when first source fails",
            async()=>{


                const provider =
                    new CompositeMarketPriceProvider([


                        {

                            async getPrice(){

                                throw new Error(
                                    "telegram failed"
                                );

                            }

                        },



                        {

                            async getPrice(){

                                return {

                                    gold18Price:19000000,

                                    currencyPrice:195000,

                                    ouncePrice:4010,

                                    updatedAt:new Date()

                                };

                            }

                        }


                    ]);



                const price =
                    await provider.getCurrentPrice();



                expect(price.gold18Price)
                    .toBe(
                        19000000
                    );


            }
        );


    }
);