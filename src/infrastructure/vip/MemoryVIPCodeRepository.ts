import {
    VIPCode
} from "../../domain/vip/entities/VIPCode";

import {
    VIPCodeRepository
} from "../../domain/vip/repositories/VIPCodeRepository";

export class MemoryVIPCodeRepository
    implements VIPCodeRepository {

    private readonly codes =
        new Map<string, VIPCode>();

    seed(
        code: VIPCode
    ): void {
        this.codes.set(
            code.code.toUpperCase(),
            code
        );
    }

    async findByCode(
        code: string
    ): Promise<VIPCode | null> {
        return this.codes.get(code.toUpperCase()) ?? null;
    }

    async redeem(
        codeId: string,
        telegramUserId: string,
        redeemedAt: Date
    ): Promise<boolean> {
        for (const [key, value] of this.codes.entries()) {
            if (value.id !== codeId || value.isUsed()) {
                continue;
            }

            this.codes.set(
                key,
                VIPCode.create({
                    ...value,
                    redeemedBy: telegramUserId,
                    redeemedAt
                })
            );

            return true;
        }

        return false;
    }
}
