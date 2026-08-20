import {
    VIPFeature
} from "../VIPFeature";

import {
    UserVIPAccess
} from "../entities/UserVIPAccess";

export interface UserVIPAccessRepository {
    save(
        access: UserVIPAccess
    ): Promise<void>;

    findActiveAccess(
        telegramUserId: string,
        feature: VIPFeature
    ): Promise<UserVIPAccess | null>;

    listActiveUsers(
        feature: VIPFeature
    ): Promise<UserVIPAccess[]>;
}