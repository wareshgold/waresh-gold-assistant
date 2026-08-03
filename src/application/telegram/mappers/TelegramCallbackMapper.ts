import {
    TelegramCallbackContext,
}
from "../callbacks/TelegramCallbackContext";


import {
    CallbackDataParser,
}
from "../callbacks/CallbackDataParser";







export class TelegramCallbackMapper {





    constructor(

        private readonly parser:

            CallbackDataParser

            =

            new CallbackDataParser()

    ) {}









    map(

        update:

            unknown

    ):

        TelegramCallbackContext {





        const telegramUpdate =

            update as Record<string, unknown>;







        const callbackQuery =

            telegramUpdate[

                "callback_query"

            ] as Record<string, unknown> | undefined;








        const from =

            callbackQuery?.[

                "from"

            ] as Record<string, unknown> | undefined;








        const message =

            callbackQuery?.[

                "message"

            ] as Record<string, unknown> | undefined;








        const chat =

            message?.[

                "chat"

            ] as Record<string, unknown> | undefined;








        const data =

            typeof callbackQuery?.[

                "data"

            ] === "string"

                ?

                callbackQuery[

                    "data"

                ] as string

                :

                "";









        return {



            chatId:

                String(

                    chat?.[

                        "id"

                    ]

                    ??

                    ""

                ),






            userId:

                String(

                    from?.[

                        "id"

                    ]

                    ??

                    ""

                ),






            username:

                typeof from?.[

                    "username"

                ] === "string"

                    ?

                    from[

                        "username"

                    ] as string

                    :

                    undefined,








            firstName:

                typeof from?.[

                    "first_name"

                ] === "string"

                    ?

                    from[

                        "first_name"

                    ] as string

                    :

                    undefined,








            data,








            callback:

                this.parser.parse(

                    data

                )



        };



    }



}