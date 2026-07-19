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



        if (
            normalized.startsWith("/")
        ) {

            command =
                normalized.split(" ")[0];

        }
        else if (
            normalized.includes("شروع") ||
            normalized.includes("start")
        ) {

            command =
                "/start";

        }
        else if (
            normalized.includes("راهنما") ||
            normalized.includes("help")
        ) {

            command =
                "/help";

        }
        else if (
            normalized.includes("قیمت") ||
            normalized.includes("طلا") ||
            normalized.includes("gold")
        ) {

            command =
                "/price";

        }



        return {

            command

        };

    }

}