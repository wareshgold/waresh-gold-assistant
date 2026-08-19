import {
    TelegramSessionStore
}
from "../state/TelegramSessionStore";


import {
    AIService
}
from "../../ai/services/AIService";



export interface TelegramAISessionResponse {


    type:

        "text";


    content:

        string;

}





interface AISessionData {


    active:

        boolean;


}






export class TelegramAISessionManager {



    private readonly state =

        "AI_SESSION";





    constructor(

        private readonly sessionStore:

            TelegramSessionStore,


        private readonly aiService:

            AIService

    ) {}







    async start(

        userId:

            string

    ):

        Promise<void> {



        await this.sessionStore.save<AISessionData, string>({

            userId,


            state:

                this.state,


            data:

            {

                active:

                    true

            },


            updatedAt:

                Date.now()

        });


    }







    async stop(

        userId:

            string

    ):

        Promise<void> {


        await this.sessionStore.delete(

            userId

        );


    }







    async isActive(

        userId:

            string

    ):

        Promise<boolean> {



        const session =

            await this.sessionStore.get<AISessionData, string>(

                userId

            );





        return (

            session?.state === this.state

            &&

            session.data.active === true

        );


    }







    async execute(

        userId:

            string,


        message:

            string

    ):

        Promise<TelegramAISessionResponse | null> {



        if (

            !(await this.isActive(userId))

        ) {


            return null;


        }







        const result =

            await this.aiService.process({

                message,


                userId

            });








        return {


            type:

                "text",



            content:

                result.content


        };


    }


}