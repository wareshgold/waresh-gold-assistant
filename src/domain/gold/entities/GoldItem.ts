import { GoldWeight } from "../value-objects/GoldWeight";
import { GoldPrice } from "../value-objects/GoldPrice";


export class GoldItem {


  constructor(

    private readonly weight: GoldWeight,

    private readonly price: GoldPrice

  ) {}



  getWeight(): GoldWeight {

    return this.weight;

  }



  getPrice(): GoldPrice {

    return this.price;

  }



  calculateValue(): number {

    return this.price
      .calculate(
        this.weight.getGrams()
      )
      .getAmount();

  }


}