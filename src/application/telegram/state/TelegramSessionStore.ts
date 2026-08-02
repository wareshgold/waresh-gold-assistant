import {
    TelegramUserSession
}
from "./TelegramUserSession";



export interface TelegramSessionStore {


    get<TData = Record<string, unknown>>(

        userId: string

    ): Promise<TelegramUserSession<TData> | null>;



    save<TData = Record<string, unknown>>(

        session: TelegramUserSession<TData>

    ): Promise<void>;



    delete(

        userId: string

    ): Promise<void>;


}