import { ApplicationResponse } from "../../common/models/ApplicationResponse";


export interface TelegramCommandExecutor {

    execute(
        command: string
    ): Promise<ApplicationResponse>;

}