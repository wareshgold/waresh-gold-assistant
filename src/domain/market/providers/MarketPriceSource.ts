export interface MarketPriceSource {


    getPrice():
        Promise<MarketPriceResult>;


}



export interface MarketPriceResult {


    gold18Price:number;


    currencyPrice:number;


    ouncePrice:number;


    updatedAt:Date;


}