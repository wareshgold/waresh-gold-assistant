import { describe, expect, it } from "vitest";

import {
    AIService
} from "./AIService";


import {
    AIClient
} from "../client/AIClient";


import {
    AIMessage
} from "../client/AIMessage";


import {
    AICompletionResult
} from "../client/AICompletionResult";


import {
    DefaultAIToolRegistry
} from "../tools/DefaultAIToolRegistry";


import {
    AIToolExecutionService
} from "./AIToolExecutionService";


import {
    AIToolDecisionService
} from "./AIToolDecisionService";


import {
    AIToolExecutor
} from "../tools/AIToolExecutor";



class MockAIClient

implements AIClient {


    responses: string[];


    constructor(

        responses: string[]

    ) {

        this.responses = responses;

    }



    async complete(

        _messages: AIMessage[]

    ):

        Promise<AICompletionResult> {


        return {

            content:

                this.responses.shift() ?? "",


            model:

                "mock-model"

        };


    }


}





describe("AIService", () => {



    it("should return normal AI response", async () => {



        const service =

            new AIService(

                new MockAIClient([

                    "Hello from AI"

                ])

            );



        const result =

            await service.process({

                message:

                    "Hello",

                userId:

                    "user-1"

            });



        expect(result.content)

            .toBe(

                "Hello from AI"

            );



    });






    it("should execute tool and continue conversation", async () => {



        const registry =

            new DefaultAIToolRegistry();



        registry.register({

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

                            100

                    }


                };


            }


        });





        const toolService =

            new AIToolExecutionService(

                new AIToolDecisionService(),

                new AIToolExecutor(

                    registry

                )

            );





        const service =

            new AIService(

                new MockAIClient([

                    `

                    <tool>

                    {

                        "toolName":"test_tool",

                        "input":{}

                    }

                    </tool>

                    `,


                    "Tool result processed"

                ]),


                registry,


                toolService

            );





        const result =

            await service.process({

                message:

                    "Run tool"

            });





        expect(result.content)

            .toBe(

                "Tool result processed"

            );





        expect(result.metadata?.toolExecuted)

            .toBe(true);



        expect(result.metadata?.toolSuccess)

            .toBe(true);



    });






    it("should expose available tools metadata", async () => {



        const registry =

            new DefaultAIToolRegistry();



        registry.register({

            name:

                "sample_tool",



            description:

                "sample",



            async execute() {


                return {

                    success:

                        true

                };


            }


        });





        const service =

            new AIService(

                new MockAIClient([

                    "response"

                ]),


                registry

            );





        const result =

            await service.process({

                message:

                    "test"

            });





        expect(

            result.metadata?.availableTools

        )

            .toContain(

                "sample_tool"

            );


    });



});