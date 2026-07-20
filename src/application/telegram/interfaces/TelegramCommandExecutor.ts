import { ApplicationResponse } from "../../common/models/ApplicationResponse";
import { IncomingMessage } from "../../common/models/IncomingMessage";


export interface TelegramCommandExecutor {


    execute(
        message: IncomingMessage
    ): Promise<ApplicationResponse>;


}