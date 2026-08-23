export class AIResponseFormatter {


    format(

        content:

            string

    ):

        string {


        if (!content) {

            return "";

        }





        let result =

            content.trim();





        result =

            this.removeToolBlocks(

                result

            );





        return result.trim();

    }







    private removeToolBlocks(

        content:

            string

    ):

        string {



        return content


            // Remove complete XML tool blocks
            .replace(

                /<[a-zA-Z0-9_-]+>\s*[\s\S]*?<\/[a-zA-Z0-9_-]+>/g,

                ""

            )


            // Remove incomplete XML tool blocks
            .replace(

                /<[a-zA-Z0-9_-]+>\s*\{[\s\S]*?(?:\}|$)/g,

                ""

            )


            // Remove raw JSON tool calls
            .replace(

                /\{\s*"toolName"\s*:\s*"[^"]+"[\s\S]*?\}/g,

                ""

            )


            // Remove orphan JSON closing braces at beginning
            .replace(

                /^\s*\}\s*/,

                ""

            )


            // Remove orphan JSON opening braces before explanation
            .replace(

                /^\s*\{\s*\}\s*/,

                ""

            )


            .trim();


    }


}