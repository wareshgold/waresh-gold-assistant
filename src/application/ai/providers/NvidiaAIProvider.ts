import {
    AIClient
} from "../client/AIClient";


import {
    AIMessage
} from "../client/AIMessage";


import {
    AICompletionResult
} from "../client/AICompletionResult";



export class NvidiaAIProvider

implements AIClient {


    constructor(

        private readonly endpoint:

            string,


        private readonly apiKey:

            string,


        private readonly model:

            string

    ) {}



    async complete(

        messages:

            AIMessage[]

    ):

        Promise<AICompletionResult> {


        const response =

            await fetch(

                this.endpoint,

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

                        JSON.stringify({

                            model:

                                this.model,


                            messages

                        })

                }

            );




        if (!response.ok) {


            throw new Error(

                `AI provider request failed: ${response.status}`

            );


        }




        const data =

            await response.json() as {

                choices?: Array<{

                    message?: {

                        content?: string;

                    };

                }>;


                model?: string;


                usage?: {

                    prompt_tokens?: number;

                    completion_tokens?: number;

                };

            };




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