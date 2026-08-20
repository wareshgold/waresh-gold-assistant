import {
    VIPFeature
} from "../../domain/vip/VIPFeature";

import {
    VIPCodeRepository
} from "../../domain/vip/repositories/VIPCodeRepository";

import {
    UserVIPAccessRepository
} from "../../domain/vip/repositories/UserVIPAccessRepository";

import {
    UserVIPAccess
} from "../../domain/vip/entities/UserVIPAccess";

export type ActivateVIPResult =
    | {
        success: true;
        access: UserVIPAccess;
    }
    | {
        success: false;
        reason:
            | "INVALID_CODE"
            | "EXPIRED_CODE"
            | "CAPACITY_FULL"
            | "ALREADY_ACTIVE";
    };

export class VIPAccessService {

    constructor(
        private readonly codeRepository: VIPCodeRepository,
        private readonly accessRepository: UserVIPAccessRepository
    ) {}

    async hasFeature(
        telegramUserId: string,
        feature: VIPFeature
    ): Promise<boolean> {
        const access =
            await this.accessRepository.findActiveAccess(
                telegramUserId,
                feature
            );

        return access !== null && access.isActive();
    }

    async activateCode(
        telegramUserId: string,
        rawCode: string
    ): Promise<ActivateVIPResult> {
        const codeValue =
            rawCode.trim().toUpperCase();

        const vipCode =
            await this.codeRepository.findByCode(
                codeValue
            );

        if (!vipCode) {
            return {
                success: false,
                reason: "INVALID_CODE"
            };
        }

        if (vipCode.isExpired()) {
            return {
                success: false,
                reason: "EXPIRED_CODE"
            };
        }

        if (!vipCode.hasCapacity()) {
            return {
                success: false,
                reason: "CAPACITY_FULL"
            };
        }

        const existing =
            await this.accessRepository.findActiveAccess(
                telegramUserId,
                vipCode.feature
            );

        if (existing && existing.isActive()) {
            return {
                success: false,
                reason: "ALREADY_ACTIVE"
            };
        }

        const access =
            UserVIPAccess.create({
                id:
                    crypto.randomUUID(),

                telegramUserId,

                feature:
                    vipCode.feature,

                activatedAt:
                    new Date(),

                expiresAt:
                    vipCode.expiresAt
            });

        await this.accessRepository.save(
            access
        );

        await this.codeRepository.incrementUsedCount(
            vipCode.id
        );

        return {
            success: true,
            access
        };
    }

    async listActiveUsers(
        feature: VIPFeature
    ): Promise<UserVIPAccess[]> {
        return this.accessRepository.listActiveUsers(
            feature
        );
    }
}