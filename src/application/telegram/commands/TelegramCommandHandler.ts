import { TelegramCommandContext }
from "./TelegramCommandContext";


export interface TelegramCommandResponse {


    type?: "text";


    content: string;


}



export interface TelegramCommandHandler {


    canHandle(

        command: string

    ): boolean;



    execute(

        context: TelegramCommandContext

    ): Promise<TelegramCommandResponse | string>;


}