import {
    describe,
    expect,
    it
} from "vitest";


import {
    AIToolDecisionService
} from "./AIToolDecisionService";




describe(
    "AIToolDecisionService",
    () => {


        const service =

            new AIToolDecisionService();






        it(
            "should detect native tool call from AI response",
            () => {


                const result =

                    service.decide({

                        content:

                            "",


                        toolCalls:

                        [

                            {

                                name:

                                    "get_current_gold_price",


                                arguments:

                                {

                                }

                            }

                        ]

                    });





                expect(result)

                    .toEqual({

                        toolName:

                            "get_current_gold_price",


                        input:

                            {}

                    });



            }
        );







        it(
            "should detect legacy tool call from AI response",
            () => {


                const result =

                    service.decide({

                        content:

`
<tool>
{
    "toolName":"get_current_gold_price",
    "input":{}
}
</tool>
`

                    });





                expect(result)

                    .toEqual({

                        toolName:

                            "get_current_gold_price",


                        input:

                            {}

                    });



            }
        );







        it(
            "should return undefined when no tool exists",
            () => {



                const result =

                    service.decide({

                        content:

                            "What is gold price today?"

                    });





                expect(result)

                    .toBeUndefined();



            }
        );








        it(
            "should return undefined for invalid tool payload",
            () => {


                const result =

                    service.decide({

                        content:

`
<tool>
{
    "invalid":"payload"
}
</tool>
`

                    });





                expect(result)

                    .toBeUndefined();



            }
        );







        it(
            "should handle invalid json safely",
            () => {



                const result =

                    service.decide({

                        content:

`
<tool>
invalid json
</tool>
`

                    });





                expect(result)

                    .toBeUndefined();



            }
        );



    }

);