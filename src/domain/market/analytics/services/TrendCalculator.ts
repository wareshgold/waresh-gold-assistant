import { PercentageChange } from "../value-objects/PercentageChange";
import { TrendDirection } from "../value-objects/TrendDirection";


export class TrendCalculator {


    constructor(
        private readonly volatilityThreshold: number = 2
    ) {


        if (volatilityThreshold < 0) {

            throw new Error(
                "Volatility threshold cannot be negative"
            );

        }

    }





    calculate(

        currentPrice: number,

        previousPrice: number

    ): TrendDirection {


        const change =
            PercentageChange.create(
                previousPrice,
                currentPrice
            );



        return TrendDirection
            .fromPercentageChange(
                change.value,
                this.volatilityThreshold
            );


    }


}