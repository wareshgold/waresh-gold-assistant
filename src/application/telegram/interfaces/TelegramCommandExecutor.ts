import {
    IncomingMessage
}
from "../../common/models/IncomingMessage";


import {
    TelegramCommandResponse
}
from "../commands/TelegramCommandHandler";





export type TelegramExecutorResponse =

    | TelegramCommandResponse

    | string;







export interface TelegramCommandExecutor {


    execute(

        message:

            IncomingMessage

    ):

        Promise<TelegramExecutorResponse>;



}