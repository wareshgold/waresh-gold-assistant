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



        return content.replace(

            /<[a-zA-Z0-9_-]+>\s*[\s\S]*?<\/[a-zA-Z0-9_-]+>/g,

            ""

        );

    }


}