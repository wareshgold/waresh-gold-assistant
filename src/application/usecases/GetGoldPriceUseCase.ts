import { ApplicationResponse }
from "../common/models/ApplicationResponse";

import { MarketPriceProvider }
from "../../domain/market/providers/MarketPriceProvider";

import { GetCurrentMarketPriceUseCase }
from "../market/GetCurrentMarketPriceUseCase";



export class GetGoldPriceUseCase {


    constructor(

        private readonly priceSource:

            MarketPriceProvider
            |
            GetCurrentMarketPriceUseCase

    ) {}





    async execute():

        Promise<ApplicationResponse> {


        const price =

            "execute" in this.priceSource

                ? await this.priceSource.execute()

                : await this.priceSource.getCurrentPrice();





        return {


            type:
                "text",



            content:
                "",




            metadata: {


                gold18Price:

                    price.gold18Price,


                currencyPrice:

                    price.currencyPrice,


                ouncePrice:

                    price.ouncePrice,


                updatedAt:

                    price.updatedAt


            }


        };


    }


}