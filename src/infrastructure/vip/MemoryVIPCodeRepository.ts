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

    async incrementUsedCount(
        codeId: string
    ): Promise<void> {
        for (const [key, value] of this.codes.entries()) {
            if (value.id === codeId) {
                this.codes.set(
                    key,
                    VIPCode.create({
                        ...value,
                        usedCount:
                            value.usedCount + 1
                    })
                );
            }
        }
    }
}