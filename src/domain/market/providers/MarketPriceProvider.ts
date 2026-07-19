import { MarketPrice } from "../entities/MarketPrice";


export interface MarketPriceProvider {


  getCurrentPrice():
    Promise<MarketPrice>;


}