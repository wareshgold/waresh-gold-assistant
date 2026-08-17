import {
    describe,
    expect,
    it
}
from "vitest";


import {
    AIToolExecutionService
}
from "./AIToolExecutionService";


import {
    AIToolDecisionService
}
from "./AIToolDecisionService";


import {
    AIToolExecutor
}
from "../tools/AIToolExecutor";


import {
    DefaultAIToolRegistry
}
from "../tools/DefaultAIToolRegistry";



describe(

    "AIToolExecutionService",

    () => {



        it(

            "should execute native tool call",

            async () => {


                const registry =

                    new DefaultAIToolRegistry();



                registry.register({

                    name:

                        "test_tool",



                    description:

                        "test tool",



                    async execute(

                        input,

                        context

                    ) {


                        return {

                            success:

                                true,


                            data:

                            {

                                input,

                                userId:

                                    context.userId

                            }

                        };


                    }


                });



                const service =

                    new AIToolExecutionService(

                        new AIToolDecisionService(),

                        new AIToolExecutor(

                            registry

                        )

                    );



                const result =

                    await service.executeIfRequired({

                        content:

                            "",


                        toolCalls:

                        [

                            {

                                id:

                                    "call-1",


                                name:

                                    "test_tool",


                                arguments:

                                {

                                    value:

                                        123

                                }

                            }

                        ]

                    }, {

                        userId:

                            "user-1"

                    });



                expect(

                    result?.success

                )

                    .toBe(true);



                expect(

                    result?.data

                )

                    .toEqual({

                        input:

                        {

                            value:

                                123

                        },


                        userId:

                            "user-1"

                    });


            }

        );





        it(

            "should execute legacy tool call",

            async () => {



                const registry =

                    new DefaultAIToolRegistry();



                registry.register({

                    name:

                        "test_tool",



                    description:

                        "test tool",



                    async execute(

                        input,

                        context

                    ) {


                        return {

                            success:

                                true,


                            data:

                            {

                                input,

                                userId:

                                    context.userId

                            }

                        };


                    }


                });



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

                            "toolName":"test_tool",

                            "input":{

                                "value":123

                            }

                        }

                        </tool>

                        `,

                        {

                            userId:

                                "user-1"

                        }

                    );



                expect(

                    result?.success

                )

                    .toBe(true);



                expect(

                    result?.data

                )

                    .toEqual({

                        input:

                        {

                            value:

                                123

                        },


                        userId:

                            "user-1"

                    });


            }

        );





        it(

            "should return undefined when no tool requested",

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

                        "normal AI response"

                    );



                expect(result)

                    .toBeUndefined();



            }

        );





        it(

            "should return failed result when requested tool does not exist",

            async () => {



                const service =

                    new AIToolExecutionService(

                        new AIToolDecisionService(),

                        new AIToolExecutor(

                            new DefaultAIToolRegistry()

                        )

                    );



                const result =

                    await service.executeIfRequired(`

                    <tool>

                    {

                        "toolName":"missing_tool",

                        "input":{}

                    }

                    </tool>

                `);



                expect(result?.success)

                    .toBe(false);



                expect(result?.error)

                    .toContain(

                        "AI tool not found"

                    );


        });



    }

);