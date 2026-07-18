import { TelegramUpdate } from "../models/TelegramUpdate";
import { TelegramUpdateReceiver } from "./TelegramUpdateReceiver";


export class FakeTelegramUpdateReceiver
implements TelegramUpdateReceiver {


    public updates: TelegramUpdate[] = [];


    async receive(
        update: TelegramUpdate
    ): Promise<void>{

        this.updates.push(update);

    }


}