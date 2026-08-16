import { describe, expect, it } from "vitest";

import {
    AIService
} from "./services/AIService";


import {
    AIClient
} from "./client/AIClient";


import {
    AIMessage
} from "./client/AIMessage";


import {
    AICompletionResult
} from "./client/AICompletionResult";


import {
    DefaultAIToolRegistry
} from "./tools/DefaultAIToolRegistry";


import {
    AIToolExecutor
} from "./tools/AIToolExecutor";


import {
    AIToolDecisionService
} from "./services/AIToolDecisionService";


import {
    AIToolExecutionService
} from "./services/AIToolExecutionService";


import {
    GetCurrentGoldPriceTool
} from "./tools/market/GetCurrentGoldPriceTool";



class MockAIClient

implements AIClient {



    private responses: string[];



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





describe("AI Tool Execution Integration", () => {



    it("should execute gold price tool through complete AI flow", async () => {



        const registry =

            new DefaultAIToolRegistry();





        const goldPriceUseCase = {



            async execute() {



                return {


                    gold18k:

                        19215328


                };


            }


        } as any;





        registry.register(

            new GetCurrentGoldPriceTool(

                goldPriceUseCase

            )

        );





        const executionService =

            new AIToolExecutionService(

                new AIToolDecisionService(),


                new AIToolExecutor(

                    registry

                )

            );





        const aiService =

            new AIService(

                new MockAIClient([


                    `

                    <tool>

                    {

                        "toolName":"get_current_gold_price",

                        "input":{}

                    }

                    </tool>

                    `,


                    "Current gold price fetched successfully"

                ]),


                registry,


                executionService

            );





        const response =

            await aiService.process({

                message:

                    "قیمت طلا چنده؟",


                userId:

                    "user-1"

            });





        expect(response.content)

            .toBe(

                "Current gold price fetched successfully"

            );





        expect(response.metadata?.toolExecuted)

            .toBe(true);





        expect(response.metadata?.toolSuccess)

            .toBe(true);





        expect(response.metadata?.availableTools)

            .toContain(

                "get_current_gold_price"

            );



    });



});