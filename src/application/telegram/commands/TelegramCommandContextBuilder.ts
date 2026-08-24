import { TelegramCommandContext }
from "./TelegramCommandContext";



export class TelegramCommandContextBuilder {



    build(

        message: string,

        userId: string = "",

        args: string[] = [],

        username?: string,

        firstName?: string

    ): TelegramCommandContext {



        const normalized =

            message

                .trim()

                .toLowerCase();




        const parts =

            normalized

                .split(/\s+/)

                .filter(Boolean);




        let command =

            normalized;




        let argumentsList =

            args;




        if (normalized.startsWith("/")) {


            command =

                parts[0];


            argumentsList =

                parts.slice(1);


        }

        else if (

            normalized.includes("شروع") ||

            normalized.includes("start")

        ) {


            command = "/start";


        }

        else if (

            normalized.includes("راهنما") ||

            normalized.includes("help")

        ) {


            command = "/help";


        }        else if (

            normalized.includes("محاسبه") ||

            normalized.includes("حساب") ||

            normalized.includes("فاکتور") ||

            normalized.includes("اجرت") ||

            normalized.includes("گرم") ||

            /[\d]+\s*گرم/.test(normalized) ||

            /\d+%/.test(normalized)

        ) {

            command = "/ai";

            argumentsList = [normalized];

        }

        else if (

            normalized.includes("قیمت") ||

            normalized.includes("طلا") ||

            normalized.includes("gold")

        ) {



            command = "/price";



        }




        return {


            chatId:

                userId,


            userId,


            username,


            firstName,


            command,


            arguments:

                argumentsList


        };


    }


}