import { PercentageChange } 
from "../value-objects/PercentageChange";

import { TrendDirection } 
from "../value-objects/TrendDirection";

import { PriceRange } 
from "../value-objects/PriceRange";



export class MarketAnalytics {


    constructor(

        private readonly currentPrice: number,

        private readonly previousPrice: number,

        private readonly change: PercentageChange,

        private readonly trend: TrendDirection,

        private readonly volatility: number,

        private readonly priceRange: PriceRange,

        private readonly analyzedAt: Date

    ) {


        if (currentPrice <= 0) {

            throw new Error(
                "Current price must be positive"
            );

        }


        if (previousPrice <= 0) {

            throw new Error(
                "Previous price must be positive"
            );

        }


        if (volatility < 0) {

            throw new Error(
                "Volatility cannot be negative"
            );

        }


    }




    getCurrentPrice(): number {

        return this.currentPrice;

    }



    getPreviousPrice(): number {

        return this.previousPrice;

    }



    getChange(): PercentageChange {

        return this.change;

    }



    getTrend(): TrendDirection {

        return this.trend;

    }



    getVolatility(): number {

        return this.volatility;

    }



    getPriceRange(): PriceRange {

        return this.priceRange;

    }



    getAnalyzedAt(): Date {

        return this.analyzedAt;

    }


}