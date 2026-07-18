import {
  MarketPrice
} from "../entities/MarketPrice";


export interface MarketPriceProvider {

  getCurrentPrice(): MarketPrice;

}