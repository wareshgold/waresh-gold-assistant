import { TelegramCommandContext }
from "./TelegramCommandContext";



export interface TelegramCommandResponse {


    type?:
        "text";



    content:
        string;



    replyMarkup?:
        unknown;



}





export interface TelegramCommandMetadata {


    command:
        string;



    description:
        string;



}





export interface TelegramCommandHandler {


    metadata?():

        TelegramCommandMetadata;



    canHandle(

        command:
            string

    ): boolean;



    execute(

        context:
            TelegramCommandContext

    ):
        Promise<TelegramCommandResponse | string>;



}