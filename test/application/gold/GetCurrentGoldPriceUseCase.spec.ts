import { describe, expect, it } from "vitest";

import {
  GetCurrentGoldPriceUseCase
} from "../../../src/application/gold/GetCurrentGoldPriceUseCase";


import {
  MarketPriceProvider
} from "../../../src/domain/market/providers/MarketPriceProvider";


describe(
  "Get Current Gold Price Use Case",
  ()=>{


    it(
      "should return current gold price",
      async ()=>{


        const fakeProvider: MarketPriceProvider = {


          async getCurrentPrice(){


            return {

              gold18Price: 18000000,

              currencyPrice: 180000,

              updatedAt:
                new Date()

            };


          }


        };



        const useCase =
          new GetCurrentGoldPriceUseCase(
            fakeProvider
          );



        const result =
          await useCase.execute();



        expect(result.price)
          .toBe(18000000);



      }
    );


  }
);