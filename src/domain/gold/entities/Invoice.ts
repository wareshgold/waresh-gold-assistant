import { InvoiceItem } from "./InvoiceItem";


export class Invoice {


  private readonly items: InvoiceItem[];



  constructor(
    items: InvoiceItem[]
  ) {


    if (items.length === 0) {

      throw new Error(
        "Invoice must contain at least one item"
      );

    }


    this.items = items;

  }




  getItems(): InvoiceItem[] {

    return [
      ...this.items
    ];

  }





  getTotalAmount(): number {


    return this.items.reduce(

      (total, item) => {


        const invoiceItem =
          item as any;



        if (
          typeof invoiceItem.getTotal === "function"
        ) {

          return (
            total +
            invoiceItem
              .getTotal()
              .amount
          );

        }



        if (
          invoiceItem.total
        ) {

          return (
            total +
            invoiceItem.total.amount
          );

        }



        return total;


      },

      0

    );


  }


}