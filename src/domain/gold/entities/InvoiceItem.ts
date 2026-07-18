import { GoldItem } from "./GoldItem";
import { Labor } from "../value-objects/Labor";
import { Profit } from "../value-objects/Profit";
import { Tax } from "../value-objects/Tax";
import { Discount } from "../value-objects/Discount";


export class InvoiceItem {


  constructor(

    private readonly gold: GoldItem,

    private readonly labor: Labor,

    private readonly profit: Profit,

    private readonly tax: Tax,

    private readonly discount: Discount

  ) {}



  getGold(): GoldItem {

    return this.gold;

  }


  getLabor(): Labor {

    return this.labor;

  }


  getProfit(): Profit {

    return this.profit;

  }


  getTax(): Tax {

    return this.tax;

  }


  getDiscount(): Discount {

    return this.discount;

  }


}