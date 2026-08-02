import {
    TelegramSessionStore
}
from "./TelegramSessionStore";


import {
    TelegramUserSession
}
from "./TelegramUserSession";




export class MemoryTelegramSessionStore

implements TelegramSessionStore {



    private readonly sessions =

        new Map<

            string,

            TelegramUserSession<any, any>

        >();







    async get<

        TData = Record<string, unknown>,

        TState = string

    >(

        userId: string

    ): Promise<TelegramUserSession<TData, TState> | null> {



        const session =

            this.sessions.get(

                userId

            );



        if (!session) {


            return null;


        }



        return session as TelegramUserSession<TData, TState>;

    }







    async save<

        TData = Record<string, unknown>,

        TState = string

    >(

        session:

            TelegramUserSession<TData, TState>

    ): Promise<void> {



        this.sessions.set(

            session.userId,

            session as TelegramUserSession<any, any>

        );

    }







    async delete(

        userId: string

    ): Promise<void> {



        this.sessions.delete(

            userId

        );

    }


}