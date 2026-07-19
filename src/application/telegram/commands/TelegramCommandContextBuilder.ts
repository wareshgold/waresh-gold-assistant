import { TelegramCommandContext } from "./TelegramCommandContext";


export class TelegramCommandContextBuilder {


    build(
        message: string
    ): TelegramCommandContext {


        const normalized =
            message
                .trim()
                .toLowerCase();



        let command =
            normalized;



        if(
            normalized.includes("قیمت") ||
            normalized.includes("طلا") ||
            normalized.includes("gold")
        ){

            command =
                "/price";

        }



        if(
            normalized.includes("شروع") ||
            normalized.includes("start")
        ){

            command =
                "/start";

        }



        if(
            normalized.includes("راهنما") ||
            normalized.includes("help")
        ){

            command =
                "/help";

        }



        return {

            command

        };

    }

}