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








export interface TelegramDocumentPayload {


    document:
        string | Uint8Array;



    fileName:
        string;



    caption?:
        string;



}









export interface TelegramCommandResponse {



    type?:
        "text"
        |
        "photo"
        |
        "document";




    content:
        string;





    photo?:
        TelegramPhotoPayload;





    document?:
        TelegramDocumentPayload;





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

    ):
        boolean;





    execute(

        context:
            TelegramCommandContext

    ):
        Promise<TelegramCommandResponse | string>;



}