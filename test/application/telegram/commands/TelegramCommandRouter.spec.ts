import { describe, expect, it } from "vitest";

import { TelegramCommandRouter }
from "../../../../src/application/telegram/commands/TelegramCommandRouter";

import { TelegramCommandHandler }
from "../../../../src/application/telegram/commands/TelegramCommandHandler";

import { TelegramCommandContext }
from "../../../../src/application/telegram/commands/TelegramCommandContext";



class FakeCommandHandler
implements TelegramCommandHandler {


    constructor(
        private readonly commandName: string,
        private readonly response: string
    ) {}



    canHandle(
        command: string
    ): boolean {

        return command === this.commandName;

    }



    async execute(
        context: TelegramCommandContext
    ): Promise<string> {

        return this.response;

    }

}





describe(
    "TelegramCommandRouter",
    () => {



        it(
            "should execute matching handler",
            async()=>{


                const router =
                    new TelegramCommandRouter([

                        new FakeCommandHandler(
                            "/analytics",
                            "analytics response"
                        )

                    ]);



                const result =
                    await router.execute({

                        chatId:"1",

                        command:"/analytics",

                        arguments:[]

                    });



                expect(result)
                    .toBe(
                        "analytics response"
                    );


            }
        );





        it(
            "should return invalid command message",
            async()=>{


                const router =
                    new TelegramCommandRouter([

                    ]);



                const result =
                    await router.execute({

                        chatId:"1",

                        command:"unknown",

                        arguments:[]

                    });



                expect(result.content)
                    .toContain(
                        "دستور نامعتبر است"
                    );


            }
        );





        it(
            "should normalize command before matching",
            async()=>{


                const router =
                    new TelegramCommandRouter([

                        new FakeCommandHandler(
                            "/test",
                            "ok"
                        )

                    ]);



                const result =
                    await router.execute({

                        chatId:"1",

                        command:"  /TEST  ",

                        arguments:[]

                    });



                expect(result)
                    .toBe(
                        "ok"
                    );


            }
        );



    }
);