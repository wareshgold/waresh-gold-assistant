import {
    MarketChartService
}
from "./chart/MarketChartService";


import {
    MarketChartPoint
}
from "./chart/MarketChartPoint";





export interface GetMarketChartOutput {


    items:
        MarketChartPoint[];


}








export class GetMarketChartUseCase {





    constructor(

        private readonly service:
            MarketChartService

    ) {}









    async execute(

        limit: number = 48

    ):
        Promise<GetMarketChartOutput> {





        const items =

            await this.service
                .getChart(limit);








        return {


            items



        };



    }






}