import { TelegramSessionStore } from "../state/TelegramSessionStore";
import { TelegramConversationFlow } from "./TelegramConversationFlow";


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

    ): Promise<any> {



        console.log(
            "CONVERSATION CHECK:",
            {
                userId,
                message
            }
        );



        const session =
            await this.sessionStore.get(
                userId
            );



        console.log(
            "SESSION RESULT:",
            session
        );



        if (!session) {

            console.log(
                "NO ACTIVE SESSION"
            );

            return null;

        }



        console.log(
            "SESSION STATE:",
            session.state
        );



        const flow =
            this.flows.find(

                item =>
                    item.canHandle(
                        session.state
                    )

            );



        console.log(
            "FOUND FLOW:",
            !!flow
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