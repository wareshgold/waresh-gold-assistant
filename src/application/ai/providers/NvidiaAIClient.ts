import {
    AIClient
} from "../client/AIClient";


import {
    AIMessage
} from "../client/AIMessage";


import {
    AICompletionResult
} from "../client/AICompletionResult";



export class NvidiaAIClient

implements AIClient {



    constructor(

        private readonly apiKey:

            string,


        private readonly baseUrl:

            string

    ) {}





    async complete(

        messages:

            AIMessage[]

    ):

        Promise<AICompletionResult> {



        const response =

            await fetch(

                `${this.baseUrl}/chat/completions`,

                {

                    method:

                        "POST",


                    headers:

                    {

                        "Content-Type":

                            "application/json",


                        "Authorization":

                            `Bearer ${this.apiKey}`

                    },


                    body:

                        JSON.stringify(

                        {

                            model:

                                "nvidia/nemotron",

                            messages

                        })

                }

            );





        if (!response.ok) {


            throw new Error(

                `NVIDIA AI request failed: ${response.status}`

            );


        }





        const data =

            await response.json() as any;





        return {

            content:

                data.choices?.[0]?.message?.content ?? "",


            model:

                data.model,


            usage:

                {

                    inputTokens:

                        data.usage?.prompt_tokens,


                    outputTokens:

                        data.usage?.completion_tokens

                }


        };


    }


}