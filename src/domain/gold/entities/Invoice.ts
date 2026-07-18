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

        return total + item.total.amount;

      },

      0

    );

  }


}