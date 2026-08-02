import {
    TelegramUserSession
}
from "./TelegramUserSession";


export interface TelegramSessionStore {


    get(
        userId: string
    ): Promise<TelegramUserSession | null>;



    save(
        session: TelegramUserSession
    ): Promise<void>;



    delete(
        userId: string
    ): Promise<void>;


}