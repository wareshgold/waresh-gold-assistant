export interface AIToolValidationResult {


    success: boolean;


    data?: unknown;


    error?: string;


}





export class AIToolInputValidator {



    validate(

        schema: unknown,

        input: unknown

    ): AIToolValidationResult {



        if (!schema) {


            return {

                success:

                    true,


                data:

                    input

            };


        }




        const validator =

            schema as {

                safeParse?: (

                    value: unknown

                ) => {

                    success: boolean;

                    data?: unknown;

                    error?: unknown;

                };

            };





        if (

            typeof validator.safeParse !== "function"

        ) {


            return {

                success:

                    true,


                data:

                    input

            };


        }





        const result =

            validator.safeParse(

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