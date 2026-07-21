import { TelegramCommandResponse } 
from "./commands/TelegramCommandHandler";


export class TelegramResponseFormatter {



    format(

        response: TelegramCommandResponse | string

    ): string {



        const text =


            typeof response === "string"

                ? response

                : response.content;



        return this.formatCopyableNumbers(

            text

        );


    }





    private formatCopyableNumbers(

        text: string

    ): string {



        return text.replace(

            /(?<!\d)(\d{4,})(?!\d)/g,

            (match) => {

                return `<code>${match}</code>`;

            }

        );


    }


}