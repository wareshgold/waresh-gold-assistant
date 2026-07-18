import { Invoice } from "../../domain/gold/entities/Invoice";
import { InvoiceItem } from "../../domain/gold/entities/InvoiceItem";



export interface CalculateInvoiceInput {

  items: InvoiceItem[];

}



export interface CalculateInvoiceOutput {

  total: number;

}




export class CalculateInvoiceUseCase {


  execute(
    input: CalculateInvoiceInput
  ): CalculateInvoiceOutput {


    const invoice =
      new Invoice(
        input.items
      );



    return {

      total:
        invoice.getTotalAmount()

    };

  }


}