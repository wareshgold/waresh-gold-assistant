import { TelegramUserProfileStore }
from "./TelegramUserProfileStore";


import { TelegramUserProfile }
from "./TelegramUserProfile";



export class MemoryTelegramUserProfileStore

implements TelegramUserProfileStore {


    private readonly profiles =

        new Map<string, TelegramUserProfile>();



    async get(

        userId: string

    ): Promise<TelegramUserProfile | null> {


        return (

            this.profiles.get(userId)

            ??

            null

        );

    }



    async save(

        profile: TelegramUserProfile

    ): Promise<void> {


        this.profiles.set(

            profile.userId,

            profile

        );

    }


}