import { TelegramSessionStore } from "./TelegramSessionStore";
import { TelegramUserSession } from "./TelegramUserSession";


export class MemoryTelegramSessionStore

implements TelegramSessionStore {



    private readonly sessions =

        new Map<string, TelegramUserSession>();





    async get<TData = Record<string, unknown>>(

        userId: string

    ): Promise<TelegramUserSession<TData> | null> {



        const session =

            this.sessions.get(

                userId

            );



        if (!session) {

            return null;

        }



        return session as TelegramUserSession<TData>;

    }






    async save<TData = Record<string, unknown>>(

        session: TelegramUserSession<TData>

    ): Promise<void> {



        this.sessions.set(

            session.userId,

            session as TelegramUserSession

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