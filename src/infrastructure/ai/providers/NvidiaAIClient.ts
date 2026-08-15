import {
    AIClient
}
from "../../../application/ai/client/AIClient";


import {
    AIMessage
}
from "../../../application/ai/client/AIMessage";


import {
    AICompletionResult
}
from "../../../application/ai/client/AICompletionResult";





interface NvidiaResponse {

    choices?: {

        message?: {

            content?: string;

        };

    }[];


    model?: string;


    usage?: {

        prompt_tokens?: number;


        completion_tokens?: number;

    };

}





export class NvidiaAIClient

implements AIClient {



    constructor(

        private readonly apiKey:

            string,


        private readonly apiUrl:

            string =

                "https://integrate.api.nvidia.com/v1/chat/completions"

    ) {}







    async complete(

        messages:

            AIMessage[]

    ):

        Promise<AICompletionResult> {



        const response =

            await fetch(

                this.apiUrl,

                {


                    method:

                        "POST",



                    headers:

                    {

                        "Content-Type":

                            "application/json",


                        Authorization:

                            `Bearer ${this.apiKey}`

                    },



                    body:

                        JSON.stringify({

                            model:

                                "meta/llama-3.1-8b-instruct",



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

            await response.json() as NvidiaResponse;






        return {


            content:

                data.choices?.[0]?.message?.content ??

                "",



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