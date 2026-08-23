import {
    describe,
    expect,
    it
}
from "vitest";


import {
    AIService
}
from "../../../src/application/ai/services/AIService";


import {
    AIClient
}
from "../../../src/application/ai/client/AIClient";


import {
    AIToolExecutionService
}
from "../../../src/application/ai/services/AIToolExecutionService";


import {
    MemoryAIConversationStore
}
from "../../../src/application/ai/memory/MemoryAIConversationStore";





describe(

    "AIService",

    () => {



        it(

            "should process AI request and return response",

            async () => {



                const fakeClient:

                    AIClient = {



                        async complete() {



                            return {


                                content:

                                    "قیمت طلا محاسبه شد.",



                                model:

                                    "test-model"


                            };


                        }


                    };







                const service =

                    new AIService(

                        fakeClient

                    );







                const result =

                    await service.process({



                        message:

                            "قیمت طلا چطور است؟",



                        userId:

                            "123"


                    });







                expect(

                    result.content

                )

                .toBe(

                    "قیمت طلا محاسبه شد."

                );




                expect(

                    result.metadata?.model

                )

                .toBe(

                    "test-model"

                );



            }

        );






        it(

            "should execute tool and ask AI for final response",

            async () => {



                let calls = 0;





                const fakeClient:

                    AIClient = {



                        async complete() {



                            calls++;





                            if (

                                calls === 1

                            ) {



                                return {


                                    content:

`
<tool>
{
 "toolName":"get_current_gold_price",
 "input":{}
}
</tool>
`,


                                    model:

                                        "test-model"


                                };


                            }






                            return {


                                content:

                                    "قیمت فعلی طلا ۱۹ میلیون تومان است.",


                                model:

                                    "test-model"


                            };



                        }


                    };







                const fakeExecutionService:

                    AIToolExecutionService = {



                        async executeIfRequired() {



                            return {


                                success:

                                    true,


                                data:

                                {

                                    price:

                                        19000000

                                }


                            };


                        }


                    } as AIToolExecutionService;







                const service =

                    new AIService(

                        fakeClient,

                        undefined,

                        fakeExecutionService

                    );







                const result =

                    await service.process({



                        message:

                            "قیمت طلا چنده؟"


                    });







                expect(

                    result.content

                )

                .toBe(

                    "قیمت فعلی طلا ۱۹ میلیون تومان است."

                );





                expect(

                    result.metadata?.toolExecuted

                )

                .toBe(

                    true

                );



            }

        );






        it(

            "should preserve conversation memory",

            async () => {



                const memory =

                    new MemoryAIConversationStore();





                const fakeClient:

                    AIClient = {



                        async complete() {



                            return {


                                content:

                                    "سلام علی، خوش برگشتی.",


                                model:

                                    "test-model"


                            };


                        }


                    };





                const service =

                    new AIService(

                        fakeClient,

                        undefined,

                        undefined,

                        undefined,

                        memory

                    );





                await service.process({

                    message:

                        "من علی هستم.",

                    userId:

                        "123"

                });





                await service.process({

                    message:

                        "اسم من چی بود؟",

                    userId:

                        "123"

                });





                const history =

                    await memory.getHistory(

                        "123"

                    );





                expect(

                    history

                )

                    .toHaveLength(

                        4

                    );





                expect(

                    history.map(

                        message =>

                            message.content

                    )

                )

                    .toEqual([

                        "من علی هستم.",

                        "سلام علی، خوش برگشتی.",

                        "اسم من چی بود؟",

                        "سلام علی، خوش برگشتی."

                    ]);

            }

        );



    }

);