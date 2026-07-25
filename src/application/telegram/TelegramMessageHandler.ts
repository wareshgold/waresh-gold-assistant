import { TelegramCommandExecutor }
from "./interfaces/TelegramCommandExecutor";


import { IncomingMessage }
from "../common/models/IncomingMessage";


import { TelegramResponseFormatter }
from "./TelegramResponseFormatter";




export interface TelegramHandledResponse {


    content: string;


    replyMarkup?: any;


}





export class TelegramMessageHandler {




    constructor(


        private readonly commandService:
            TelegramCommandExecutor,


        private readonly formatter?:
            TelegramResponseFormatter



    ) {}








    async handle(

        message:
            IncomingMessage

    ): Promise<string> {



        const response =

            await this.commandService.execute(

                message

            );




        if (!response) {


            return "";


        }






        if (typeof response === "string") {


            return response;


        }





        return response.content ?? "";


    }









    async handleResponse(

        message:
            IncomingMessage

    ): Promise<TelegramHandledResponse | string> {



        const response =

            await this.commandService.execute(

                message

            );






        if (!response) {


            return "";


        }






        if (typeof response === "string") {


            return response;


        }







        return {


            ...response,



            content:


                this.formatter


                    ? this.formatter.format(response)

                    : response.content



        };



    }





}