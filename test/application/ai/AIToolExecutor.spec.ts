import {
    describe,
    expect,
    it
}
from "vitest";


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
    "AIToolExecutor",
    () => {



        it(
            "should execute registered tool",
            async () => {



                const registry =

                    new DefaultAIToolRegistry();






                const fakeTool:

                    AITool = {



                        name:

                            "test_tool",



                        description:

                            "test tool",




                        async execute() {



                            return {


                                success:

                                    true,


                                data:

                                {

                                    value:

                                        123

                                }


                            };


                        }


                    };






                registry.register(

                    fakeTool

                );






                const executor =

                    new AIToolExecutor(

                        registry

                    );






                const result =

                    await executor.execute(

                        "test_tool",

                        {},

                        {

                            userId:

                                "123"

                        }

                    );






                expect(

                    result.success

                )

                .toBe(

                    true

                );






                expect(

                    result.data

                )

                .toEqual(

                    {

                        value:

                            123

                    }

                );



            }

        );








        it(
            "should return error for unknown tool",
            async () => {



                const executor =

                    new AIToolExecutor(

                        new DefaultAIToolRegistry()

                    );






                const result =

                    await executor.execute(

                        "unknown_tool",

                        {}

                    );






                expect(

                    result.success

                )

                .toBe(

                    false

                );



            }

        );



    }

);