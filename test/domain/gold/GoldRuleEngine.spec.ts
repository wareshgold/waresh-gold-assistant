import { describe, it, expect } from "vitest";

import { createGoldRuleEngine }
from "../../../src/domain/gold/services/createGoldRuleEngine";


describe(
  "Gold Rule Engine",
  () => {


    it(
      "should calculate complete gold price",
      () => {


        const engine =
          createGoldRuleEngine();


        const result =
          engine.execute({

            weight: 5,

            goldPrice: 18000000,

            laborPercent: 15,

            profitPercent: 7,

            taxPercent: 9,

            discount: 0

          });


        expect(
          result.goldValue
        )
        .toBe(90000000);



        expect(
          result.labor
        )
        .toBe(13500000);



        expect(
          result.profit
        )
        .toBe(7245000);



        expect(
          result.tax
        )
        .toBe(1867050);



        expect(
          result.finalPrice
        )
        .toBe(112612050);


      }
    );


  }
);