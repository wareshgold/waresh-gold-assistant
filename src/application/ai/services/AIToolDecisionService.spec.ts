import {
    describe,
    expect,
    it
}
from "vitest";


import {
    AIToolDecisionService
}
from "./AIToolDecisionService";



describe(

    "AIToolDecisionService",

    () => {



        it(

            "should parse native tool calls",

            () => {



                const service =

                    new AIToolDecisionService();





                const result =

                    service.decide({

                        content:

                            "",

                        toolCalls:

                        [

                            {

                                id:

                                    "call-1",

                                name:

                                    "get_current_gold_price",

                                arguments:

                                {

                                    purity:

                                        18

                                }

                            }

                        ]

                    });





                expect(

                    result

                )

                    .toEqual({

                        toolName:

                            "get_current_gold_price",

                        input:

                        {

                            purity:

                                18

                        }

                    });


            }

        );





        it(

            "should parse legacy tool wrapper",

            () => {



                const service =

                    new AIToolDecisionService();





                const result =

                    service.decide(

`
<tool>
{
    "toolName":"get_current_gold_price",
    "input":{}
}
</tool>
`

                    );





                expect(

                    result

                )

                    .toEqual({

                        toolName:

                            "get_current_gold_price",

                        input:

                        {}

                    });


            }

        );





        it(

            "should parse NVIDIA pseudo tool call format",

            () => {



                const service =

                    new AIToolDecisionService();





                const result =

                    service.decide(

`
<get_current_gold_price>
{
    "toolName":"get_current_gold_price",
    "input":{}
}
</get_current_gold_price>
`

                    );





                expect(

                    result

                )

                    .toEqual({

                        toolName:

                            "get_current_gold_price",

                        input:

                            {}

                    });


            }

        );





        it(

            "should parse NVIDIA pseudo tool call when input contains values",

            () => {



                const service =

                    new AIToolDecisionService();





                const result =

                    service.decide(

`
<get_current_gold_price>
{
    "toolName":"get_current_gold_price",
    "input":{
        "purity":18
    }
}
</get_current_gold_price>
`

                    );





                expect(

                    result

                )

                    .toEqual({

                        toolName:

                            "get_current_gold_price",

                        input:

                        {

                            purity:

                                18

                        }

                    });


            }

        );





        it(

            "should parse named tool call with direct JSON input",

            () => {



                const service =

                    new AIToolDecisionService();





                const result =

                    service.decide(

`
<get_current_gold_price>
{
    "purity":18
}
</get_current_gold_price>
`

                    );





                expect(

                    result

                )

                    .toEqual({

                        toolName:

                            "get_current_gold_price",

                        input:

                        {

                            purity:

                                18

                        }

                    });


            }

        );





        it(

            "should return undefined for invalid tool call",

            () => {



                const service =

                    new AIToolDecisionService();





                const result =

                    service.decide(

`
<get_current_gold_price>
invalid json
</get_current_gold_price>
`

                    );





                expect(

                    result

                )

                    .toBeUndefined();


            }

        );





        it(

            "should return undefined when no tool call exists",

            () => {



                const service =

                    new AIToolDecisionService();





                const result =

                    service.decide(

                        "سلام، قیمت طلا را می‌خواهم."

                    );





                expect(

                    result

                )

                    .toBeUndefined();


            }

        );


    }

);