import {
    MarketChartRenderResult
}
from "../../application/market/chart/MarketChartRenderer";





export class MarketChartImageGenerator {





    async generate(

        chart:
            MarketChartRenderResult

    ):
        Promise<Uint8Array> {




        const svg =

            this.createSvg(

                chart

            );







        return new TextEncoder()

            .encode(

                svg

            );



    }









    private createSvg(

        chart:
            MarketChartRenderResult

    ):
        string {





        const width = 800;

        const height = 400;







        const max =

            Math.max(

                ...chart.values

            );




        const min =

            Math.min(

                ...chart.values

            );







        const points =

            chart.values.map(

                (value, index) => {



                    const x =

                        50 +

                        (

                            index /

                            Math.max(

                                chart.values.length - 1,

                                1

                            )

                        )

                        *

                        (

                            width - 100

                        );





                    const y =

                        height -

                        50 -

                        (

                            (

                                value - min

                            )

                            /

                            Math.max(

                                max - min,

                                1

                            )

                        )

                        *

                        (

                            height - 100

                        );






                    return `${x},${y}`;


                }


            ).join(" ");









        return `

<svg xmlns="http://www.w3.org/2000/svg"

width="${width}"

height="${height}">



<rect width="100%" height="100%" fill="white"/>



<text x="50" y="40"

font-size="24">

${chart.title}

</text>



<polyline

fill="none"

stroke="black"

stroke-width="3"

points="${points}"

/>



</svg>

`;



    }






}