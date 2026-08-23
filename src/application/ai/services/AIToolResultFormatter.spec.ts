import {
    describe,
    expect,
    it
}
from "vitest";


import {
    AIToolResultFormatter
}
from "./AIToolResultFormatter";



describe(

    "AIToolResultFormatter",

    () => {



        it(

            "should format current gold price tool result",

            () => {



                const formatter =

                    new AIToolResultFormatter();





                const result =

                {

                    success:

                        true,


                    data:

                    {

                        type:

                            "CURRENT_GOLD_PRICE",


                        purity:

                            18,


                        price:

                            29200000,


                        currency:

                            "TOMAN",


                        source:

                            "MARKET"

                    }

                };





                const output =

                    formatter.format(

                        result

                    );





                expect(

                    output

                )

                    .toContain(

                        "طلای 18 عیار"

                    );





                expect(

                    output

                )

                    .toContain(

                        "29,200,000"

                    );



            }

        );






        it(

            "should format failed tool result",

            () => {



                const formatter =

                    new AIToolResultFormatter();





                const output =

                    formatter.format({

                        success:

                            false,


                        error:

                            "market unavailable"

                    });





                expect(

                    output

                )

                    .toContain(

                        "market unavailable"

                    );


            }

        );






        it(

            "should format generic tool result",

            () => {



                const formatter =

                    new AIToolResultFormatter();





                const output =

                    formatter.format({

                        success:

                            true,


                        data:

                        {

                            value:

                                100

                        }

                    });





                expect(

                    output

                )

                    .toContain(

                        "\"value\""

                    );


            }

        );



    }

);