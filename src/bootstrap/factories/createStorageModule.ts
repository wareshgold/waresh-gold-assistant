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
import { D1GoldCalculationHistoryRepository }
from "../../infrastructure/gold/repositories/d1/D1GoldCalculationHistoryRepository";
import { GoldCalculationHistoryRepository }
from "../../domain/gold/repositories/GoldCalculationHistoryRepository";
import { MemoryAIConversationStore }
from "../../application/ai/memory/MemoryAIConversationStore";
import { D1AIConversationMemory }
from "../../infrastructure/ai/memory/D1AIConversationMemory";
import { AIConversationMemory }
from "../../application/ai/memory/AIConversationMemory";
import { D1CustomerRepository }
from "../../infrastructure/customer/D1CustomerRepository";
import { MemoryCustomerRepository }
from "../../infrastructure/customer/MemoryCustomerRepository";
import { CustomerRepository }
from "../../domain/customer/repositories/CustomerRepository";
import { D1SessionService }
from "../../infrastructure/auth/D1SessionService";
import { MemorySessionService }
from "../../infrastructure/auth/MemorySessionService";
import { SessionService }
from "../../domain/auth/providers/SessionService";
import { AppEnv }
from "../../shared/config/env";

export function createStorageModule(env: AppEnv) {
    const snapshotRepository = env.waresh_gold_db
        ? new D1MarketSnapshotRepository(env.waresh_gold_db)
        : new MemoryMarketSnapshotRepository();

    const sessionStore = env.ENVIRONMENT === "production"
        ? new D1TelegramSessionStore(env.waresh_gold_db)
        : new MemoryTelegramSessionStore();

    const userProfileStore = env.ENVIRONMENT === "production"
        ? new D1TelegramUserProfileStore(env.waresh_gold_db)
        : new MemoryTelegramUserProfileStore();

    const goldCalculationHistoryRepository: GoldCalculationHistoryRepository =
        env.waresh_gold_db
            ? new D1GoldCalculationHistoryRepository(env.waresh_gold_db)
            : {
                async save() {},
                async getByUserId() {
                    return [];
                },
            };

    const aiConversationMemory: AIConversationMemory =
        env.ENVIRONMENT === "production"
            ? new D1AIConversationMemory(env.waresh_gold_db, 20)
            : new MemoryAIConversationStore(20);

    const customerRepository: CustomerRepository = env.waresh_gold_db
        ? new D1CustomerRepository(env.waresh_gold_db)
        : new MemoryCustomerRepository();

    const sessionService: SessionService = env.waresh_gold_db
        ? new D1SessionService(env.waresh_gold_db)
        : new MemorySessionService();

    return {
        snapshotRepository,
        sessionStore,
        userProfileStore,
        goldCalculationHistoryRepository,
        aiConversationMemory,
        customerRepository,
        sessionService,
    };
}
