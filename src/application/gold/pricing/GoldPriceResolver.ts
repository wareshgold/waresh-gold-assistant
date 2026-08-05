import {
    GetCurrentGoldPriceUseCase
}
from "../GetCurrentGoldPriceUseCase";


import {
    GoldPriceSource
}
from "./GoldPriceSource";



export interface GoldPriceResolverResult {

    price: number;

    source: GoldPriceSource;

}



export interface GoldPriceResolver {


    resolve(
        source: GoldPriceSource,
        manualPrice?: number
    ):
        Promise<GoldPriceResolverResult>;


}




export class DefaultGoldPriceResolver

implements GoldPriceResolver {



    constructor(

        private readonly getCurrentGoldPriceUseCase:
            GetCurrentGoldPriceUseCase

    ) {}





    async resolve(

        source:
            GoldPriceSource,


        manualPrice?:
            number

    ):
        Promise<GoldPriceResolverResult> {



        switch(source) {



            case GoldPriceSource.MARKET:


                const marketPrice =

                    await this.getCurrentGoldPriceUseCase
                        .execute();



                return {

                    price:
                        marketPrice.price,


                    source:

                        GoldPriceSource.MARKET

                };





            case GoldPriceSource.MANUAL:



                if(

                    manualPrice === undefined

                    ||

                    manualPrice <= 0

                ) {

                    throw new Error(
                        "Manual gold price must be positive"
                    );

                }




                return {


                    price:
                        manualPrice,


                    source:

                        GoldPriceSource.MANUAL


                };





            default:


                throw new Error(

                    "Unsupported gold price source"

                );

        }


    }



}