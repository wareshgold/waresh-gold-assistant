import {
    UserVIPAccess
} from "../entities/UserVIPAccess";

export interface VIPActivationRepository {
    activate(
        codeId: string,
        telegramUserId: string,
        redeemedAt: Date,
        access: UserVIPAccess
    ): Promise<boolean>;
}
