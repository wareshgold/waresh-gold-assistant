import { TelegramCommandContext } from "./TelegramCommandContext";


export interface TelegramCommandHandler {


    canHandle(
        command: string
    ): boolean;



    execute(
        context: TelegramCommandContext
    ): Promise<any>;


}