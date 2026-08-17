export interface AIToolDefinition {


    name:

        string;



    description:

        string;



    parameters?:

        {

            type:

                string;



            properties?:

                Record<string, unknown>;



            required?:

                string[];

        };


}