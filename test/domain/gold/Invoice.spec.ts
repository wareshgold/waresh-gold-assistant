import { describe, it, expect } from "vitest";

import { Invoice } from "../../../src/domain/gold/entities/Invoice";

import { InvoiceItem } from "../../../src/domain/gold/entities/InvoiceItem";



describe(
  "Invoice Entity",
  () => {



    it(
      "should calculate invoice total",
      () => {


        const item1 = {

          total: {
            amount: 1000000
          }

        } as InvoiceItem;



        const item2 = {

          total: {
            amount: 2000000
          }

        } as InvoiceItem;



        const invoice =
          new Invoice([
            item1,
            item2
          ]);



        expect(
          invoice.getItems().length
        )
        .toBe(2);



        expect(
          invoice.getTotalAmount()
        )
        .toBe(3000000);


      }
    );



    it(
      "should reject empty invoice",
      () => {


        expect(
          () => new Invoice([])
        )
        .toThrow();


      }
    );


  }
);