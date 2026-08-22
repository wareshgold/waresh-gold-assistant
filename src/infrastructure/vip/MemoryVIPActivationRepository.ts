import {
    UserVIPAccess
} from "../../domain/vip/entities/UserVIPAccess";

import {
    VIPActivationRepository
} from "../../domain/vip/repositories/VIPActivationRepository";

import {
    VIPCodeRepository
} from "../../domain/vip/repositories/VIPCodeRepository";

import {
    UserVIPAccessRepository
} from "../../domain/vip/repositories/UserVIPAccessRepository";

export class MemoryVIPActivationRepository
    implements VIPActivationRepository {

    constructor(
        private readonly codeRepository: VIPCodeRepository,
        private readonly accessRepository: UserVIPAccessRepository
    ) {}

    async activate(
        codeId: string,
        telegramUserId: string,
        redeemedAt: Date,
        access: UserVIPAccess
    ): Promise<boolean> {
        const existing =
            await this.accessRepository.findActiveAccess(
                telegramUserId,
                access.feature
            );

        if (existing) {
            return false;
        }

        const redeemed =
            await this.codeRepository.redeem(
                codeId,
                telegramUserId,
                redeemedAt
            );

        if (!redeemed) {
            return false;
        }

        await this.accessRepository.save(
            access
        );

        return true;
    }
}
