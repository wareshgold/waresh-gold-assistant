import { Money } from "../value-objects/Money";


export class CalculationResult {

  constructor(

    public readonly goldValue: Money,

    public readonly laborAmount: Money,

    public readonly profitAmount: Money,

    public readonly taxAmount: Money,

    public readonly discountAmount: Money,

    public readonly finalAmount: Money

  ) {}

}