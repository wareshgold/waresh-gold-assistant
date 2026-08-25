import {
    describe,
    expect,
    it
} from "vitest";


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



    calls = 0;



    constructor(

        responses: string[]

    ) {

        this.responses = responses;

    }





    async complete(

        _messages: AIMessage[]

    ):

        Promise<AICompletionResult> {


        this.calls++;


        return {


            content:

                this.responses.shift() ?? "",



            model:

                "mock-model"


        };


    }


}





describe(

    "AI Tool Execution Integration",

    () => {



        it(

            "should execute gold price tool through complete AI flow",

            async () => {



                const registry =

                    new DefaultAIToolRegistry();





                const goldPriceUseCase = {



                    async execute() {



                        return {


                            price:

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





                const client =

                    new MockAIClient([

                        "This response should not be used."

                    ]);





                const aiService =

                    new AIService(

                        client,

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





                expect(

                    response.content

                )

                    .toContain(

                        "طلای ۱۸ عیار: 19,215,328 تومان"

                    );





                expect(

                    response.metadata?.toolExecuted

                )

                    .toBe(

                        true

                    );





                expect(

                    response.metadata?.toolSuccess

                )

                    .toBe(

                        true

                    );





                expect(

                    response.metadata?.toolName

                )

                    .toBe(

                        "get_current_gold_price"

                    );





                expect(

                    response.metadata?.aiProviderCalled

                )

                    .toBe(

                        false

                    );





                expect(

                    response.metadata?.model

                )

                    .toBe(

                        "local-tool-router"

                    );





                expect(

                    response.metadata?.availableTools

                )

                    .toContain(

                        "get_current_gold_price"

                    );





                expect(

                    client.calls

                )

                    .toBe(

                        0

                    );


            }

        );



    }

);