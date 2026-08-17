import {
    describe,
    expect,
    it
}
from "vitest";


import {
    AIResponseFormatter
}
from "./AIResponseFormatter";



describe(

    "AIResponseFormatter",

    () => {



        it(

            "should remove tool block leakage",

            () => {



                const formatter =

                    new AIResponseFormatter();





                const result =

`
<get_current_gold_price>
{
    "toolName":"get_current_gold_price",
    "input":{}
}
</get_current_gold_price>

قیمت فعلی طلا 29200000 تومان است.
`;





                expect(

                    formatter.format(

                        result

                    )

                )

                    .toBe(

                        "قیمت فعلی طلا 29200000 تومان است."

                    );


            }

        );






        it(

            "should keep normal responses",

            () => {



                const formatter =

                    new AIResponseFormatter();





                expect(

                    formatter.format(

                        "سلام، قیمت طلا امروز افزایش داشت."

                    )

                )

                    .toBe(

                        "سلام، قیمت طلا امروز افزایش داشت."

                    );


            }

        );



    }

);