export interface PriceSourceClient {


    fetchPrice(): Promise<RawMarketPrice>;


}



export interface RawMarketPrice {


    gold18Price: number;


    currencyPrice: number;


    ouncePrice: number;


    updatedAt: Date;


}