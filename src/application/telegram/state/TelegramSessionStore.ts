import {
    TelegramUserSession
}
from "./TelegramUserSession";



export interface TelegramSessionStore {


    get<
        TData = Record<string, unknown>,
        TState = string
    >(

        userId: string

    ): Promise<TelegramUserSession<TData, TState> | null>;



    save<
        TData = Record<string, unknown>,
        TState = string
    >(

        session: TelegramUserSession<TData, TState>

    ): Promise<void>;



    delete(

        userId: string

    ): Promise<void>;


}