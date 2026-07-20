import { TelegramSessionStore } from "./TelegramSessionStore";
import { TelegramUserSession } from "./TelegramUserSession";


export class MemoryTelegramSessionStore
implements TelegramSessionStore {


    private readonly sessions =
        new Map<string, TelegramUserSession>();



    async get(
        userId: string
    ): Promise<TelegramUserSession | null> {


        return (
            this.sessions.get(userId)
            ?? null
        );

    }



    async save(
        session: TelegramUserSession
    ): Promise<void> {


        this.sessions.set(
            session.userId,
            session
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