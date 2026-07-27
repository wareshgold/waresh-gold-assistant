import {
    TelegramCommandResponse
}
from "./commands/TelegramCommandHandler";





export class TelegramResponseFormatter {





    format(

        response:
            TelegramCommandResponse | string

    ): string {



        if (

            typeof response !== "string"

            &&

            response.type === "photo"

        ) {


            return response.content;


        }







        const text =



            typeof response === "string"

                ? response

                : response.content;







        return this.formatCopyableNumbers(

            text

        );


    }









    private formatCopyableNumbers(

        text:
            string

    ): string {



        return text.replace(


            /(<code>.*?<\/code>)|(?<!\d)(\d{4,})(?!\d)/g,


            (

                match,

                existingCode

            ) => {



                if (existingCode) {


                    return existingCode;


                }



                return `<code>${match}</code>`;


            }


        );


    }





}