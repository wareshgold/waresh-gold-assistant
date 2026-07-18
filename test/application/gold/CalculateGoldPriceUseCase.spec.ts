import { describe, it, expect } from "vitest";

import {
  CalculateGoldPriceUseCase
} from "../../../src/application/gold/CalculateGoldPriceUseCase";

import { GoldRuleEngine } from "../../../src/domain/gold/services/GoldRuleEngine";


describe(
  "Calculate Gold Price Use Case",
  () => {


    it(
      "should calculate gold price using injected engine",
      () => {


        const fakeEngine: GoldRuleEngine = {


          execute() {

            return {

              goldValue: 90000000,

              labor: 13500000,

              profit: 7245000,

              tax: 1867050,

              finalPrice: 112612050

            };

          }


        };



        const useCase =
          new CalculateGoldPriceUseCase(
            fakeEngine
          );



        const result =
          useCase.execute({

            weight: 5,

            goldPrice: 18000000,

            laborPercent: 15,

            profitPercent: 7,

            taxPercent: 9

          });



        expect(
          result.total
        )
        .toBe(112612050);


      }
    );


  }
);