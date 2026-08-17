import {
    AIToolSchema
} from "./AIToolSchema";



export interface AIProviderToolSchema {


    type:

        string;



    properties?:

        Record<string, unknown>;



    required?:

        string[];


}





export interface AIToolSchemaAdapter {


    convert<TInput>(

        schema:

            AIToolSchema<TInput> | undefined

    ):

        AIProviderToolSchema | undefined;


}





export class DefaultAIToolSchemaAdapter

implements AIToolSchemaAdapter {



    convert<TInput>(

        schema:

            AIToolSchema<TInput> | undefined

    ):

        AIProviderToolSchema | undefined {



        if (!schema) {


            return undefined;


        }





        const zodSchema =

            schema as unknown as {


                _def?:

                    {

                        shape?:

                            | (() => Record<string, unknown>)

                            | Record<string, unknown>;

                    };


            };





        const rawShape =

            zodSchema

                ._def

                ?.shape;





        if (!rawShape) {


            return {


                type:

                    "object"


            };


        }





        const shape =

            typeof rawShape === "function"

                ? rawShape()

                : rawShape;





        return {


            type:

                "object",



            properties:

                Object.keys(

                    shape

                )

                    .reduce(

                        (

                            result,

                            key

                        ) => {


                            result[key] = {};

                            return result;


                        },

                        {} as Record<string, unknown>

                    )


        };


    }


}