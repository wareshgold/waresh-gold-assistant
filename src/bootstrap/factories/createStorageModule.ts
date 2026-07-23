import { MemoryMarketSnapshotRepository }
from "../../infrastructure/market/repositories/MemoryMarketSnapshotRepository";

import { D1MarketSnapshotRepository }
from "../../infrastructure/market/repositories/d1/D1MarketSnapshotRepository";

import { MemoryTelegramSessionStore }
from "../../application/telegram/state/MemoryTelegramSessionStore";

import { D1TelegramSessionStore }
from "../../application/telegram/state/D1TelegramSessionStore";

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


    return {

        snapshotRepository,

        sessionStore

    };

}