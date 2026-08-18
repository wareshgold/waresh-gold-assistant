import {
    describe,
    expect,
    it
}
from "vitest";


import {
    AILocalToolRouter
}
from "./AILocalToolRouter";


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

    "AILocalToolRouter",

    () => {



        it(

            "should route current gold price request locally",

            async () => {



                const registry =

                    new DefaultAIToolRegistry();





                registry.register({

                    name:

                        "get_current_gold_price",


                    description:

                        "Returns current gold price",


                    async execute() {


                        return {

                            success:

                                true,


                            data:

                            {

                                type:

                                    "CURRENT_GOLD_PRICE",


                                purity:

                                    18,


                                price:

                                    19248000,


                                currency:

                                    "TOMAN",


                                source:

                                    "MARKET"

                            }

                        };


                    }


                });





                const executionService =

                    new AIToolExecutionService(

                        new AIToolDecisionService(),


                        new AIToolExecutor(

                            registry

                        )

                    );





                const router =

                    new AILocalToolRouter(

                        executionService

                    );





                const result =

                    await router.route({

                        message:

                            "قیمت طلا چند ؟",


                        userId:

                            "user-1"

                    });





                expect(

                    result.handled

                )

                    .toBe(

                        true

                    );





                expect(

                    result.toolName

                )

                    .toBe(

                        "get_current_gold_price"

                    );





                expect(

                    result.toolResult?.success

                )

                    .toBe(

                        true

                    );





                expect(

                    result.response

                )

                    .toContain(

                        "19,248,000"

                    );


            }

        );






        it(

            "should route mithqal price locally",

            async () => {



                const registry =

                    new DefaultAIToolRegistry();





                registry.register({

                    name:

                        "get_current_gold_mithqal_price",


                    description:

                        "Returns current mithqal gold price",


                    async execute() {


                        return {

                            success:

                                true,


                            data:

                            {

                                price:

                                    100000000

                            }

                        };


                    }


                });





                const executionService =

                    new AIToolExecutionService(

                        new AIToolDecisionService(),


                        new AIToolExecutor(

                            registry

                        )

                    );





                const router =

                    new AILocalToolRouter(

                        executionService

                    );





                const result =

                    await router.route({

                        message:

                            "قیمت مثقال چنده؟"

                    });





                expect(

                    result.handled

                )

                    .toBe(

                        true

                    );





                expect(

                    result.toolName

                )

                    .toBe(

                        "get_current_gold_mithqal_price"

                    );


            }

        );






        it(

            "should not intercept calculation requests",

            async () => {



                const registry =

                    new DefaultAIToolRegistry();





                registry.register({

                    name:

                        "get_current_gold_price",


                    description:

                        "Returns current gold price",


                    async execute() {


                        return {

                            success:

                                true

                        };


                    }


                });





                const executionService =

                    new AIToolExecutionService(

                        new AIToolDecisionService(),


                        new AIToolExecutor(

                            registry

                        )

                    );





                const router =

                    new AILocalToolRouter(

                        executionService

                    );





                const result =

                    await router.route({

                        message:

                            "قیمت 5 گرم طلا رو حساب کن"

                    });





                expect(

                    result.handled

                )

                    .toBe(

                        false

                    );


            }

        );






        it(

            "should not intercept general conversation",

            async () => {



                const registry =

                    new DefaultAIToolRegistry();





                const executionService =

                    new AIToolExecutionService(

                        new AIToolDecisionService(),


                        new AIToolExecutor(

                            registry

                        )

                    );





                const router =

                    new AILocalToolRouter(

                        executionService

                    );





                const result =

                    await router.route({

                        message:

                            "به نظرت امروز بازار چطوره؟"

                    });





                expect(

                    result.handled

                )

                    .toBe(

                        false

                    );


            }

        );


    }

);