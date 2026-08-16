import {
    AIToolSchema
} from "./AIToolSchema";



export interface AIToolValidationResult<TInput> {


    success: boolean;


    data?: TInput;


    error?: string;


}





export class AIToolInputValidator {



    validate<TInput>(

        schema: AIToolSchema<TInput> | undefined,

        input: unknown

    ):

        AIToolValidationResult<TInput> {



        if (!schema) {


            return {


                success:

                    true,


                data:

                    input as TInput


            };


        }





        const result =

            schema.safeParse(

                input

            );





        if (

            result.success

        ) {


            return {


                success:

                    true,


                data:

                    result.data


            };


        }





        return {


            success:

                false,


            error:

                result.error instanceof Error

                    ? result.error.message

                    : "Invalid tool input"


        };


    }


}