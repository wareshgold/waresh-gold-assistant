import {
    AIToolCall
}
from "../models/AIToolCall";





export class AIToolDecisionService {



    decide(

        content:

            string

    ):

        AIToolCall | undefined {



        const match =

            content.match(

                /<tool>(.*?)<\/tool>/s

            );





        if (!match) {



            return undefined;


        }






        try {



            const payload =

                JSON.parse(

                    match[1]

                );





            if (

                typeof payload.toolName !== "string"

            ) {



                return undefined;


            }






            return {


                toolName:

                    payload.toolName,



                input:

                    payload.input ?? {}



            };



        }

        catch {



            return undefined;


        }



    }



}