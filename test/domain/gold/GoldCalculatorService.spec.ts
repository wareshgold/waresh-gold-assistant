import { describe, it, expect } from "vitest";

import { GoldCalculatorService } from "../../../src/domain/gold/services/GoldCalculatorService";

import { Money } from "../../../src/domain/gold/value-objects/Money";
import { GoldWeight } from "../../../src/domain/gold/value-objects/GoldWeight";
import { GoldPrice } from "../../../src/domain/gold/value-objects/GoldPrice";
import { Labor } from "../../../src/domain/gold/value-objects/Labor";
import { Profit } from "../../../src/domain/gold/value-objects/Profit";
import { Tax } from "../../../src/domain/gold/value-objects/Tax";
import { Discount } from "../../../src/domain/gold/value-objects/Discount";


describe(
  "Gold Calculator Service",
  () => {

    it(
      "should calculate final gold price correctly",
      () => {

        const service =
          new GoldCalculatorService();


        const result =
          service.calculate({

            weight:
              GoldWeight.create(5),

            price:
              GoldPrice.create(
                Money.create(
                  18000000
                )
              ),

            labor:
              Labor.percentage(15),

            profit:
              Profit.percentage(7),

            tax:
              Tax.percentage(9),

            discount:
              Discount.fixed(
                Money.create(0)
              )

          });


        expect(
          result.goldValue.getAmount()
        ).toBe(90000000);


        expect(
          result.finalAmount.getAmount()
        ).toBeGreaterThan(90000000);

      }
    );

  }
);