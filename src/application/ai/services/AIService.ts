import {
    AIClient
}
from "../client/AIClient";


import {
    AIMessage
}
from "../client/AIMessage";


import {
    IncomingMessage
}
from "../../common/models/IncomingMessage";





export class AIService {



    constructor(

        private readonly client:

            AIClient

    ) {}






    async process(

        message:

            IncomingMessage

    ):

        Promise<string> {



        const messages:

            AIMessage[] = [


                {

                    role:

                        "system",


                    content:

                        "You are Waresh Gold AI assistant."

                },


                {

                    role:

                        "user",


                    content:

                        message.text

                }


            ];







        const result =

            await this.client.complete(

                messages

            );





        return result.content;



    }



}