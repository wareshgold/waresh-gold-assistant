import {
    describe,
    expect,
    it
}
from "vitest";


import {
    AIToolDecisionService
}
from "../../../src/application/ai/services/AIToolDecisionService";





describe(
    "AIToolDecisionService",
    () => {



        it(
            "should detect tool call from AI response",
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

                .toEqual(

                    {

                        toolName:

                            "get_current_gold_price",


                        input:

                            {}

                    }

                );



            }

        );







        it(
            "should return undefined when no tool exists",
            () => {



                const service =

                    new AIToolDecisionService();






                const result =

                    service.decide(

                        "normal AI response"

                    );






                expect(

                    result

                )

                .toBeUndefined();



            }

        );



    }

);