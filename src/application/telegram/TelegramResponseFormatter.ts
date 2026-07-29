import {
    TelegramCommandResponse
}
from "./commands/TelegramCommandHandler";




export class TelegramResponseFormatter {




    format(

        response:
            TelegramCommandResponse | string

    ): string {



        const content =

            typeof response === "string"

                ? response

                : response.content;





        return this.formatNumbers(content);



    }






    private formatNumbers(

        text:
            string

    ): string {


        return text.replace(

            /\d+/g,

            value =>

                `<code>${value}</code>`

        );


    }




}