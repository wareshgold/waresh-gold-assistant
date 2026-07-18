import { MarketPrice } 
from "../entities/MarketPrice";


export interface GoldPriceProvider {

  getCurrentPrice(): Promise<MarketPrice>;

}