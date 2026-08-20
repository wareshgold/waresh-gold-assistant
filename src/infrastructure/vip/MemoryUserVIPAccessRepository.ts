import {
    VIPFeature
} from "../../domain/vip/VIPFeature";

import {
    UserVIPAccess
} from "../../domain/vip/entities/UserVIPAccess";

import {
    UserVIPAccessRepository
} from "../../domain/vip/repositories/UserVIPAccessRepository";

export class MemoryUserVIPAccessRepository
    implements UserVIPAccessRepository {

    private readonly rows: UserVIPAccess[] = [];

    async save(
        access: UserVIPAccess
    ): Promise<void> {
        this.rows.push(access);
    }

    async findActiveAccess(
        telegramUserId: string,
        feature: VIPFeature
    ): Promise<UserVIPAccess | null> {
        const found =
            this.rows.find(
                row =>
                    row.telegramUserId === telegramUserId &&
                    row.feature === feature &&
                    row.isActive()
            );

        return found ?? null;
    }

    async listActiveUsers(
        feature: VIPFeature
    ): Promise<UserVIPAccess[]> {
        return this.rows.filter(
            row =>
                row.feature === feature &&
                row.isActive()
        );
    }
}