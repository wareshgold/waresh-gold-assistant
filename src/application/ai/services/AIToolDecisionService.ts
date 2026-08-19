import {
    AIToolCallDecision
}
from "../types/AIToolCallDecision";



export class AIToolDecisionService {



    public decide(

        response:

            any

    ):

        AIToolCallDecision | undefined {


        return this.decideAll(response)[0];


    }






    public decideAll(

        response:

            any

    ):

        AIToolCallDecision[] {



        if (!response) {

            return [];

        }





        const results:

            AIToolCallDecision[] = [];






        const candidates = [

            response.toolCalls,

            response.tool_calls,

            response.message?.toolCalls,

            response.message?.tool_calls,

            response.choices?.[0]?.message?.tool_calls,

            response.choices?.[0]?.message?.toolCalls,

            response.tool_call,

            response.toolCall

        ];






        for (const calls of candidates) {



            if (Array.isArray(calls)) {



                for (const call of calls) {


                    const result =

                        this.parseToolCall(

                            call

                        );



                    if (result) {

                        results.push(result);

                    }


                }



            }

            else if (calls) {



                const result =

                    this.parseToolCall(

                        calls

                    );



                if (result) {

                    results.push(result);

                }


            }


        }






        if (results.length) {


            return results;


        }






        const contents = [


            response,


            response.content,


            response.message?.content,


            response.choices?.[0]?.message?.content


        ];







        for (const content of contents) {



            const result =

                this.parseContent(

                    content

                );



            if (result) {


                results.push(result);


            }


        }





        return results;


    }






    private parseToolCall(

        call:

            any

    ):

        AIToolCallDecision | undefined {



        if (!call) {

            return undefined;

        }






        const toolName =


            call.function?.name ??

            call.name ??

            call.toolName ??

            call.tool_name;







        if (!toolName) {


            return undefined;


        }






        const rawInput =


            call.function?.arguments ??

            call.arguments ??

            call.input ??

            call.parameters ??

            call.args;






        return {


            id:

                call.id,



            toolName,



            input:

                this.parseInput(

                    rawInput

                )


        };


    }

        private parseContent(

        content:

            unknown

    ):

        AIToolCallDecision | undefined {



        if (

            typeof content !== "string" ||

            !content.trim()

        ) {


            return undefined;


        }






        const tagMatch =

            content.match(

                /<([a-zA-Z0-9_-]+)>\s*([\s\S]*?)\s*<\/\1>/

            );






        if (tagMatch) {



            const tagName =

                tagMatch[1];



            const body =

                tagMatch[2];






            const parsed =

                this.parseJsonTool(

                    body

                );






            if (parsed) {


                return parsed;


            }






            const directInput =

                this.parseInput(

                    body

                );






            if (

                tagName &&

                Object.keys(

                    directInput

                ).length

            ) {



                return {


                    toolName:

                        tagName,



                    input:

                        directInput


                };


            }


        }







        const jsonMatch =

            content.match(

                /\{[\s\S]*\}/

            );






        if (!jsonMatch) {


            return undefined;


        }






        return this.parseJsonTool(

            jsonMatch[0]

        );


    }








    private parseJsonTool(

        json:

            string

    ):

        AIToolCallDecision | undefined {



        try {


            const parsed =

                JSON.parse(

                    json

                );






            const toolName =


                parsed.name ??

                parsed.toolName ??

                parsed.tool_name;






            if (!toolName) {


                return undefined;


            }







            return {


                toolName,



                input:

                    this.parseInput(

                        parsed.arguments ??

                        parsed.input ??

                        parsed.parameters ??

                        this.extractDirectInput(

                            parsed

                        )

                    )


            };



        }

        catch {


            return undefined;


        }


    }







    private parseInput(

        value:

            unknown

    ):

        Record<string, unknown> {



        if (!value) {


            return {};


        }







        if (

            typeof value === "object"

        ) {


            return value as Record<string, unknown>;


        }







        if (

            typeof value === "string"

        ) {



            try {



                const parsed =

                    JSON.parse(

                        value

                    );






                if (

                    parsed &&

                    typeof parsed === "object"

                ) {


                    return parsed as Record<string, unknown>;

                }


            }

            catch {


                return {};

            }


        }






        return {};

    }







    private extractDirectInput(

        value:

            Record<string, unknown>

    ):

        Record<string, unknown> {



        const copy = {


            ...value


        };






        delete copy.name;

        delete copy.toolName;

        delete copy.tool_name;

        delete copy.arguments;

        delete copy.input;

        delete copy.parameters;






        return copy;


    }


}