import { describe, it, expect } from "vitest";

import {
  CalculateInvoiceUseCase
}
from "../../../src/application/gold/CalculateInvoiceUseCase";



describe(
  "Calculate Invoice Use Case",
  () => {


    it(
      "should calculate invoice total",
      () => {


        const useCase =
          new CalculateInvoiceUseCase();



        const result =
          useCase.execute({

            items: [

              {
                total: {
                  amount: 1000000
                }

              } as any,


              {
                total: {
                  amount: 2500000
                }

              } as any

            ]

          });



        expect(
          result.total
        )
        .toBe(3500000);


      }
    );


  }
);