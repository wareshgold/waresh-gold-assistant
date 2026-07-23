import {
    RefreshMarketPriceUseCase
}
from "../market/RefreshMarketPriceUseCase";


export class RefreshMarketPriceJob {


    constructor(

        private readonly refreshMarketPriceUseCase:
            RefreshMarketPriceUseCase

    ) {}



    async execute() {


        return this.refreshMarketPriceUseCase
            .execute();


    }


}