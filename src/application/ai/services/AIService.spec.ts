import {
    describe,
    expect,
    it
}
from "vitest";


import {
    AIService
}
from "./AIService";


import {
    AIClient
}
from "../client/AIClient";


import {
    AIMessage
}
from "../client/AIMessage";


import {
    AICompletionResult
}
from "../client/AICompletionResult";


import {
    DefaultAIToolRegistry
}
from "../tools/DefaultAIToolRegistry";


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
    MemoryAIConversationStore
}
from "../memory/MemoryAIConversationStore";



class MockAIClient

implements AIClient {


    responses: string[];


    receivedMessages:

        AIMessage[][] = [];



    constructor(

        responses:

            string[]

    ) {

        this.responses = responses;

    }



    async complete(

        messages:

            AIMessage[]

    ):

        Promise<AICompletionResult> {


        this.receivedMessages.push(

            messages

        );


        return {

            content:

                this.responses.shift() ?? "",


            model:

                "mock-model"

        };


    }


}





describe(

    "AIService",

    () => {



        it(

            "should return normal AI response",

            async () => {



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



                expect(

                    result.content

                )

                    .toBe(

                        "Hello from AI"

                    );



            }

        );






        it(

            "should execute tool and continue conversation",

            async () => {



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



                expect(

                    result.content

                )

                    .toBe(

                        "Tool result processed"

                    );





                expect(

                    result.metadata?.toolExecuted

                )

                    .toBe(

                        true

                    );





                expect(

                    result.metadata?.toolSuccess

                )

                    .toBe(

                        true

                    );



            }

        );






        it(

            "should expose available tools metadata",

            async () => {



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


            }

        );






        it(

            "should load conversation history before processing",

            async () => {



                const memory =

                    new MemoryAIConversationStore();





                await memory.addMessage(

                    "user-1",

                    {

                        role:

                            "user",

                        content:

                            "اسم من علی است.",

                        createdAt:

                            new Date(

                                "2026-08-16T10:00:00.000Z"

                            )

                    }

                );





                await memory.addMessage(

                    "user-1",

                    {

                        role:

                            "assistant",

                        content:

                            "سلام علی!",

                        createdAt:

                            new Date(

                                "2026-08-16T10:00:01.000Z"

                            )

                    }

                );





                const client =

                    new MockAIClient([

                        "سلام دوباره علی!"

                    ]);





                const service =

                    new AIService(

                        client,

                        undefined,

                        undefined,

                        undefined,

                        memory

                    );





                await service.process({

                    message:

                        "من را یادت هست؟",

                    userId:

                        "user-1"

                });





                const messages =

                    client.receivedMessages[0];





                expect(

                    messages

                )

                    .toEqual(

                        expect.arrayContaining([

                            {

                                role:

                                    "user",

                                content:

                                    "اسم من علی است."

                            },

                            {

                                role:

                                    "assistant",

                                content:

                                    "سلام علی!"

                            },

                            {

                                role:

                                    "user",

                                content:

                                    "من را یادت هست؟"

                            }

                        ])

                    );


            }

        );






        it(

            "should persist user and assistant messages",

            async () => {



                const memory =

                    new MemoryAIConversationStore();





                const service =

                    new AIService(

                        new MockAIClient([

                            "پاسخ اول"

                        ]),


                        undefined,


                        undefined,


                        undefined,


                        memory

                    );





                await service.process({

                    message:

                        "سوال اول",

                    userId:

                        "user-1"

                });





                const history =

                    await memory.getHistory(

                        "user-1"

                    );





                expect(

                    history

                )

                    .toHaveLength(

                        2

                    );





                expect(

                    history[0]

                )

                    .toMatchObject({

                        role:

                            "user",

                        content:

                            "سوال اول"

                    });





                expect(

                    history[1]

                )

                    .toMatchObject({

                        role:

                            "assistant",

                        content:

                            "پاسخ اول"

                    });


            }

        );



    }

);