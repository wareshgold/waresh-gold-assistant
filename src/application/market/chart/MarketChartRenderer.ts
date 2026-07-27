import {
    MarketChartPoint,
}
from "./MarketChartPoint";



export interface MarketChartRenderResult {


    title:
        string;


    labels:
        string[];


    values:
        number[];


}







export class MarketChartRenderer {





    render(

        points:
            MarketChartPoint[]

    ):
        MarketChartRenderResult {




        return {


            title:

                "نمودار قیمت طلای ۱۸ عیار",



            labels:

                points.map(

                    point =>
                        point.capturedAt
                            .toLocaleTimeString(
                                "fa-IR",
                                {
                                    hour:
                                        "2-digit",

                                    minute:
                                        "2-digit"
                                }
                            )

                ),



            values:

                points.map(

                    point =>
                        point.gold18Price

                )



        };

    }



}