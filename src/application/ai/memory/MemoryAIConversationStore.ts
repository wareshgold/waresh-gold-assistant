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







    async getHistory(

        userId:

            string

    ):

        Promise<AIConversationMessage[]> {



        return (

            this.conversations.get(

                userId

            ) ?? []

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



        history.push(

            message

        );



        this.conversations.set(

            userId,

            history

        );


    }


}