import { MarketMomentum }
from "../value-objects/MarketMomentum";




export class MomentumCalculator {



    constructor(

        private readonly strongThreshold:
            number = 3

    ) {}





    calculate(

        currentPrice:
            number,

        previousPrice:
            number

    ):

        MarketMomentum {



        if (

            previousPrice <= 0

        ) {

            throw new Error(
                "Previous price must be positive"
            );

        }





        const change =

            (

                (

                    currentPrice -
                    previousPrice

                )

                /

                previousPrice

            )

            *

            100;






        if (

            change >= this.strongThreshold

        ) {

            return MarketMomentum.strongUp();

        }





        if (

            change > 0

        ) {

            return MarketMomentum.weakUp();

        }





        if (

            change <= -this.strongThreshold

        ) {

            return MarketMomentum.strongDown();

        }





        if (

            change < 0

        ) {

            return MarketMomentum.weakDown();

        }





        return MarketMomentum.neutral();


    }


}