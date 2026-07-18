import { InvoiceItem } from "./InvoiceItem";


export class CalculationContext {


  constructor(

    private readonly item: InvoiceItem

  ) {}



  getItem(): InvoiceItem {

    return this.item;

  }


}