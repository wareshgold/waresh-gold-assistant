import {
    AIToolContext
} from "./AITool";


import {
    AIToolRegistry
} from "./AIToolRegistry";


import {
    AIToolResult
} from "./AIToolResult";


import {
    AIToolInputValidator
} from "./AIToolInputValidator";



export class AIToolExecutor {



    private readonly inputValidator:

        AIToolInputValidator;




    constructor(

        private readonly registry:

            AIToolRegistry,


        inputValidator?:

            AIToolInputValidator

    ) {


        this.inputValidator =

            inputValidator ??

            new AIToolInputValidator();


    }






    async execute<TInput = unknown>(

        toolName:

            string,


        input:

            unknown,


        context:

            AIToolContext = {}

    ):

        Promise<AIToolResult> {



        const tool =

            this.registry.getTool<TInput>(

                toolName

            );





        if (!tool) {


            return {

                success:

                    false,


                error:

                    `AI tool not found: ${toolName}`

            };


        }





        const normalizedInput =

            this.normalizeInput(

                input

            );





        const validation =

            this.inputValidator.validate<TInput>(

                tool.inputSchema,

                normalizedInput

            );





        if (

            !validation.success

        ) {


            return {


                success:

                    false,


                error:

                    validation.error ??

                    "Invalid tool input"


            };


        }





        try {


            return await tool.execute(

                validation.data as TInput,

                context

            );


        }

        catch(error) {


            return {


                success:

                    false,


                error:

                    error instanceof Error

                        ? error.message

                        : "AI tool execution failed"


            };


        }


    }








    private normalizeInput(

        input:

            unknown

    ):

        unknown {



        if (

            typeof input === "string"

        ) {


            return this.normalizeValue(

                input

            );


        }





        if (

            Array.isArray(input)

        ) {


            return input.map(

                item =>

                    this.normalizeInput(

                        item

                    )

            );


        }





        if (

            typeof input !== "object" ||

            input === null

        ) {


            return input;


        }





        const object =

            input as Record<string, unknown>;





        return Object.fromEntries(

            Object.entries(object)

                .map(

                    ([key, value]) => [


                        key,


                        this.normalizeValue(

                            value

                        )


                    ]

                )

        );


    }








    private normalizeValue(

        value:

            unknown

    ):

        unknown {



        if (

            typeof value !== "string"

        ) {


            if (

                Array.isArray(value)

            ) {


                return value.map(

                    item =>

                        this.normalizeInput(

                            item

                        )

                );


            }





            if (

                typeof value === "object" &&

                value !== null

            ) {


                return this.normalizeInput(

                    value

                );


            }





            return value;


        }






        const trimmed =

            value.trim();





        if (

            trimmed === ""

        ) {


            return value;


        }






        if (

            /^-?\d+(\.\d+)?$/

                .test(trimmed)

        ) {


            return Number(

                trimmed

            );


        }






        try {


            const parsed =

                JSON.parse(

                    trimmed

                );





            if (

                Array.isArray(parsed)

            ) {


                return parsed.map(

                    item =>

                        this.normalizeInput(

                            item

                        )

                );


            }





            if (

                typeof parsed === "object" &&

                parsed !== null

            ) {


                return this.normalizeInput(

                    parsed

                );


            }


        }

        catch {


            // ignore invalid JSON


        }





        return value;


    }


}