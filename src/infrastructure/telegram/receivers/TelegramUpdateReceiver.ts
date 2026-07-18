import { TelegramUpdate } from "../models/TelegramUpdate";


export interface TelegramUpdateReceiver {


    receive(
        update: TelegramUpdate
    ): Promise<void>;


}