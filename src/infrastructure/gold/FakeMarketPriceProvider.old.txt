import {
  MarketPriceProvider
} from "../../domain/gold/providers/MarketPriceProvider";


import {
  GoldPrice
} from "../../domain/gold/value-objects/GoldPrice";


import {
  Money
} from "../../domain/gold/value-objects/Money";



export class FakeMarketPriceProvider
implements MarketPriceProvider {


  getCurrentPrice(): GoldPrice {


    return new GoldPrice(
      new Money(18000000)
    );


  }


}