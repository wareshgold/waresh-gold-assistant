import { TelegramUserProfile }
from "./TelegramUserProfile";


export interface TelegramUserProfileStore {


    get(
        userId: string
    ): Promise<TelegramUserProfile | null>;



    save(
        profile: TelegramUserProfile
    ): Promise<void>;


}