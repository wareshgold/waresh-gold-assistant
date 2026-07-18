import {
  MarketPriceProvider
} from "../../domain/market/providers/MarketPriceProvider";


import {
  MarketPrice
} from "../../domain/market/entities/MarketPrice";



export class FakeMarketPriceProvider
implements MarketPriceProvider {


  getCurrentPrice(): MarketPrice {


    return new MarketPrice(
      18000000
    );


  }


}