import {
    TelegramSessionStore
}
from "../state/TelegramSessionStore";


import {
    TelegramConversationFlow
}
from "./TelegramConversationFlow";




export class TelegramConversationManager {



    constructor(

        private readonly sessionStore:

            TelegramSessionStore,


        private readonly flows:

            TelegramConversationFlow[]

    ) {}






    async execute(

        userId: string,

        message: string

    ): Promise<{

        type: "text";

        content: string;

        metadata?: Record<string, unknown>;

    } | null> {



        const session =

            await this.sessionStore.get(

                userId

            );



        if (!session) {


            return null;


        }






        const flow =

            this.flows.find(


                item =>

                    item.canHandle(

                        session.state

                    )


            );






        if (!flow) {


            return null;


        }






        return flow.execute(

            userId,

            message

        );


    }


}