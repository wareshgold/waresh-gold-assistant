import { Money } from "./Money";


export class CalculationResult {


  constructor(

    public readonly goldValue: Money,

    public readonly labor: Money,

    public readonly profit: Money,

    public readonly tax: Money,

    public readonly finalPrice: Money

  ) {}



  get total(): Money {

    return this.finalPrice;

  }

}