import {
    TelegramCommandContext
}
from "./TelegramCommandContext";





export interface TelegramPhotoPayload {


    photo:
        string | Uint8Array;



    caption?:
        string;



}







export interface TelegramCommandResponse {



    type?:
        "text"
        |
        "photo";



    content:
        string;



    photo?:
        TelegramPhotoPayload;



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