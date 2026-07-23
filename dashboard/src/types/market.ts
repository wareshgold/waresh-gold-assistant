export interface MarketPrice {

  gold18Price: number;

  currencyPrice: number;

  ouncePrice: number;

  updatedAt: string;

}



export interface GoldBubble {

  marketPrice: number;

  intrinsicPrice: number;

  bubbleAmount: number;

  bubblePercentage: number;

  updatedAt: string;

}