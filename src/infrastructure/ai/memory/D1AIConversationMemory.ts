import {
    AIConversationMemory
}
from "../../../application/ai/memory/AIConversationMemory";


import {
    AIConversationMessage
}
from "../../../application/ai/memory/AIConversationMessage";



interface AIConversationMessageRow {


    id:

        number;


    user_id:

        string;


    role:

        "user" | "assistant";


    content:

        string;


    created_at:

        number;


}





export class D1AIConversationMemory

implements AIConversationMemory {



    constructor(

        private readonly db:

            D1Database,


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



        const result =

            await this.db

                .prepare(

                    `
                    SELECT
                        id,
                        user_id,
                        role,
                        content,
                        created_at
                    FROM ai_conversation_messages
                    WHERE user_id = ?
                    ORDER BY created_at DESC, id DESC
                    LIMIT ?
                    `

                )

                .bind(

                    userId,

                    this.historyLimit

                )

                .all<AIConversationMessageRow>();





        return (

            result.results ?? []

        )

            .map(

                row => ({

                    role:

                        row.role,



                    content:

                        row.content,



                    createdAt:

                        new Date(

                            row.created_at

                        )

                })

            )

            .reverse();

    }







    async addMessage(

        userId:

            string,


        message:

            AIConversationMessage

    ):

        Promise<void> {



        await this.db

            .prepare(

                `
                INSERT INTO ai_conversation_messages
                (
                    user_id,
                    role,
                    content,
                    created_at
                )
                VALUES
                (?, ?, ?, ?)
                `

            )

            .bind(

                userId,

                message.role,

                message.content,

                message.createdAt.getTime()

            )

            .run();


    }


}