import { describe, it, expect } from "vitest";

import { Percentage }
from "../../../src/domain/gold/value-objects/Percentage";


describe(
  "Percentage Value Object",
  () => {


    it(
      "should calculate percentage amount",
      () => {

        const percentage =
          Percentage.create(10);


        expect(
          percentage.apply(1000000)
        )
        .toBe(100000);


        expect(
          percentage.getValue()
        )
        .toBe(10);

      }
    );


    it(
      "should reject invalid percentage",
      () => {

        expect(
          () => Percentage.create(120)
        )
        .toThrow();

      }
    );


  }
);