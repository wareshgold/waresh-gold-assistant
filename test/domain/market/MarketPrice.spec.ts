import { describe, it, expect } from "vitest";

import { MarketPrice }
from "../../../src/domain/market/entities/MarketPrice";


describe(
  "Market Price",
  () => {


    it(
      "should create valid market price",
      () => {


        const price =
          new MarketPrice(
            18000000,
            180000,
            new Date()
          );


        expect(
          price.gold18Price
        )
        .toBe(18000000);


      }
    );



    it(
      "should reject invalid gold price",
      () => {


        expect(
          () =>
          new MarketPrice(
            0,
            180000,
            new Date()
          )
        )
        .toThrow();


      }
    );


  }
);