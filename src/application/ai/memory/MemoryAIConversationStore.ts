import {
    AIConversationMemory
}
from "./AIConversationMemory";


import {
    AIConversationMessage
}
from "./AIConversationMessage";



export class MemoryAIConversationStore

implements AIConversationMemory {



    private readonly conversations:

        Map<string, AIConversationMessage[]>

        =

        new Map();





    constructor(

        private readonly historyLimit:

            number = 20

    ) {



        if (

            historyLimit <= 0

        ) {


            throw new Error(

                "AI conversation history limit must be greater than zero"

            );


        }


    }







    async getHistory(

        userId:

            string

    ):

        Promise<AIConversationMessage[]> {



        const history =

            this.conversations.get(

                userId

            ) ?? [];





        return history

            .slice(

                -this.historyLimit

            )

            .map(

                message => ({

                    role:

                        message.role,

                    content:

                        message.content,

                    createdAt:

                        new Date(

                            message.createdAt.getTime()

                        )

                })

            );

    }







    async addMessage(

        userId:

            string,


        message:

            AIConversationMessage

    ):

        Promise<void> {



        const history =

            this.conversations.get(

                userId

            ) ?? [];





        history.push({

            role:

                message.role,

            content:

                message.content,

            createdAt:

                new Date(

                    message.createdAt.getTime()

                )

        });





        if (

            history.length >

            this.historyLimit

        ) {


            history.splice(

                0,

                history.length -

                this.historyLimit

            );


        }





        this.conversations.set(

            userId,

            history

        );


    }


}