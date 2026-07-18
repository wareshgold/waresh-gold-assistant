import { describe, it, expect } from "vitest";

import { GoldItem } from "../../../src/domain/gold/entities/GoldItem";
import { GoldWeight } from "../../../src/domain/gold/value-objects/GoldWeight";
import { GoldPrice } from "../../../src/domain/gold/value-objects/GoldPrice";
import { Money } from "../../../src/domain/gold/value-objects/Money";


describe(
  "Gold Item Entity",
  () => {


    it(
      "should calculate gold value",
      () => {


        const gold =
          new GoldItem(

            GoldWeight.create(5),

            GoldPrice.create(
              Money.create(18000000)
            )

          );


        expect(
          gold.calculateValue()
        )
        .toBe(90000000);


      }
    );


  }
);