import {
    VIPCode
} from "../entities/VIPCode";

export interface VIPCodeRepository {
    findByCode(
        code: string
    ): Promise<VIPCode | null>;

    redeem(
        codeId: string,
        telegramUserId: string,
        redeemedAt: Date
    ): Promise<boolean>;
}
