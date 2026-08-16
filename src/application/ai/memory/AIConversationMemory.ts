import {
    AIConversationMessage
}
from "./AIConversationMessage";



export interface AIConversationMemory {



    getHistory(

        userId:

            string

    ):

        Promise<AIConversationMessage[]>;





    addMessage(

        userId:

            string,


        message:

            AIConversationMessage

    ):

        Promise<void>;



}