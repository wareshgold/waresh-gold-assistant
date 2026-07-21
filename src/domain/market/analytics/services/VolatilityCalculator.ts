import { PercentageChange } from "../value-objects/PercentageChange";


export class VolatilityCalculator {


    calculate(

        prices: number[]

    ): number {


        if (prices.length < 2) {

            return 0;

        }



        const changes =

            prices
                .slice(1)
                .map(

                    (price, index) =>

                        PercentageChange
                            .create(
                                prices[index],
                                price
                            )
                            .absoluteValue

                );



        const average =

            changes.reduce(

                (sum, value) =>

                    sum + value,

                0

            ) / changes.length;



        return Number(
            average.toFixed(2)
        );


    }


}