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
    VIPActivationRepository
} from "../../domain/vip/repositories/VIPActivationRepository";

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
            | "CODE_ALREADY_USED"
            | "ALREADY_ACTIVE";
    };

export class VIPAccessService {

    constructor(
        private readonly codeRepository: VIPCodeRepository,
        private readonly accessRepository: UserVIPAccessRepository,
        private readonly activationRepository: VIPActivationRepository,
        private readonly ownerUserIds: string[] = []
    ) {}

    async hasFeature(
        telegramUserId: string,
        feature: VIPFeature
    ): Promise<boolean> {
        if (this.isOwner(telegramUserId)) {
            return true;
        }

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
            rawCode.trim();

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

        if (vipCode.isUsed()) {
            return {
                success: false,
                reason: "CODE_ALREADY_USED"
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

        const redeemedAt = new Date();

        const access =
            UserVIPAccess.create({
                id:
                    crypto.randomUUID(),

                telegramUserId,

                feature:
                    vipCode.feature,

                activatedAt:
                    redeemedAt,

                expiresAt:
                    vipCode.expiresAt
            });

        const activated =
            await this.activationRepository.activate(
                vipCode.id,
                telegramUserId,
                redeemedAt,
                access
            );

        if (activated) {
            return {
                success: true,
                access
            };
        }

        const currentCode =
            await this.codeRepository.findByCode(
                codeValue
            );

        if (!currentCode || currentCode.isUsed()) {
            return {
                success: false,
                reason: "CODE_ALREADY_USED"
            };
        }

        const currentAccess =
            await this.accessRepository.findActiveAccess(
                telegramUserId,
                vipCode.feature
            );

        if (currentAccess && currentAccess.isActive()) {
            return {
                success: false,
                reason: "ALREADY_ACTIVE"
            };
        }

        return {
            success: false,
            reason: "CODE_ALREADY_USED"
        };
    }

    async listActiveUsers(
        feature: VIPFeature
    ): Promise<UserVIPAccess[]> {
        const fromRepo =
            await this.accessRepository.listActiveUsers(
                feature
            );

        const existingIds =
            new Set(
                fromRepo.map(
                    item => item.telegramUserId
                )
            );

        const owners =
            this.ownerUserIds
                .filter(id => id && !existingIds.has(id))
                .map(id =>
                    UserVIPAccess.create({
                        id: `owner-${id}`,
                        telegramUserId: id,
                        feature,
                        activatedAt: new Date(),
                        expiresAt: null
                    })
                );

        return [
            ...fromRepo,
            ...owners
        ];
    }

    private isOwner(
        telegramUserId: string
    ): boolean {
        return this.ownerUserIds.includes(
            telegramUserId
        );
    }
}
