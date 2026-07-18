import { describe, it, expect } from "vitest";

import { CalculationResult }
from "../../../src/domain/gold/value-objects/CalculationResult";

import { Money }
from "../../../src/domain/gold/value-objects/Money";



describe(
  "Calculation Result Value Object",
  () => {



    it(
      "should store calculation amounts",
      () => {


        const result =
          new CalculationResult(

            new Money(1000000),

            new Money(100000),

            new Money(50000),

            new Money(9000),

            new Money(1159000)

          );



        expect(
          result.goldValue.amount
        )
        .toBe(1000000);



        expect(
          result.finalPrice.amount
        )
        .toBe(1159000);



        expect(
          result.total.amount
        )
        .toBe(1159000);


      }
    );


  }
);