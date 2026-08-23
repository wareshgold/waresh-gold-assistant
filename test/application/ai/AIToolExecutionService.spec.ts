import {
    describe,
    expect,
    it
}
from "vitest";


import {
    AIToolExecutionService
}
from "../../../src/application/ai/services/AIToolExecutionService";


import {
    AIToolDecisionService
}
from "../../../src/application/ai/services/AIToolDecisionService";


import {
    AIToolExecutor
}
from "../../../src/application/ai/tools/AIToolExecutor";


import {
    DefaultAIToolRegistry
}
from "../../../src/application/ai/tools/DefaultAIToolRegistry";


import {
    AITool
}
from "../../../src/application/ai/tools/AITool";





describe(
    "AIToolExecutionService",
    () => {



        it(
            "should execute tool requested by AI response",
            async () => {



                const registry =

                    new DefaultAIToolRegistry();






                const fakeTool:

                    AITool = {



                        name:

                            "get_current_gold_price",



                        description:

                            "returns price",





                        async execute() {



                            return {


                                success:

                                    true,


                                data:

                                {

                                    price:

                                        1000000

                                }


                            };


                        }


                    };






                registry.register(

                    fakeTool

                );






                const service =

                    new AIToolExecutionService(

                        new AIToolDecisionService(),

                        new AIToolExecutor(

                            registry

                        )

                    );







                const result =

                    await service.executeIfRequired(

`
<tool>
{
    "toolName":"get_current_gold_price",
    "input":{}
}
</tool>
`,
                        {

                            userId:

                                "123"

                        }

                    );







                expect(

                    result?.success

                )

                .toBe(

                    true

                );






                expect(

                    result?.data

                )

                .toEqual(

                    {

                        price:

                            1000000

                    }

                );



            }

        );






        it(
            "should not execute when AI does not request tool",
            async () => {



                const service =

                    new AIToolExecutionService(

                        new AIToolDecisionService(),

                        new AIToolExecutor(

                            new DefaultAIToolRegistry()

                        )

                    );






                const result =

                    await service.executeIfRequired(

                        "simple answer"

                    );






                expect(

                    result

                )

                .toBeUndefined();



            }

        );



    }

);