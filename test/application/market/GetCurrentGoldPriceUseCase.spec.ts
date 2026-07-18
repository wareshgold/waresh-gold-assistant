import { describe, it, expect } from "vitest";


import { GetCurrentGoldPriceUseCase }
from "../../../src/application/market/GetCurrentGoldPriceUseCase";


import { GoldPriceProvider }
from "../../../src/domain/market/interfaces/GoldPriceProvider";


import { MarketPrice }
from "../../../src/domain/market/entities/MarketPrice";



describe(
  "Get Current Gold Price Use Case",
  () => {


    it(
      "should return current market price",
      async () => {


        const fakeProvider: GoldPriceProvider = {


          async getCurrentPrice(){


            return new MarketPrice(

              18000000,

              180000,

              new Date()

            );


          }


        };



        const useCase =
          new GetCurrentGoldPriceUseCase(
            fakeProvider
          );



        const result =
          await useCase.execute();



        expect(
          result.gold18Price
        )
        .toBe(18000000);



        expect(
          result.currencyPrice
        )
        .toBe(180000);



      }
    );


  }
);