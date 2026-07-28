import { MemoryMarketSnapshotRepository }
from "../../infrastructure/market/repositories/MemoryMarketSnapshotRepository";


import { D1MarketSnapshotRepository }
from "../../infrastructure/market/repositories/d1/D1MarketSnapshotRepository";


import { MemoryTelegramSessionStore }
from "../../application/telegram/state/MemoryTelegramSessionStore";


import { D1TelegramSessionStore }
from "../../application/telegram/state/D1TelegramSessionStore";


import { MemoryTelegramUserProfileStore }
from "../../application/telegram/profile/MemoryTelegramUserProfileStore";


import { D1TelegramUserProfileStore }
from "../../application/telegram/profile/D1TelegramUserProfileStore";


import { AppEnv }
from "../../shared/config/env";



export function createStorageModule(

    env: AppEnv

) {



    const snapshotRepository =

        env.waresh_gold_db

            ? new D1MarketSnapshotRepository(

                env.waresh_gold_db

            )

            : new MemoryMarketSnapshotRepository();





    const sessionStore =

        env.ENVIRONMENT === "production"

            ? new D1TelegramSessionStore(

                env.waresh_gold_db

            )

            : new MemoryTelegramSessionStore();





    const userProfileStore =


        env.ENVIRONMENT === "production"


            ? new D1TelegramUserProfileStore(

                env.waresh_gold_db

            )


            : new MemoryTelegramUserProfileStore();





    return {


        snapshotRepository,


        sessionStore,


        userProfileStore


    };


}