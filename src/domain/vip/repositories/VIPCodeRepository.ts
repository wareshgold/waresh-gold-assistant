import {
    VIPCode
} from "../entities/VIPCode";

export interface VIPCodeRepository {
    findByCode(
        code: string
    ): Promise<VIPCode | null>;

    incrementUsedCount(
        codeId: string
    ): Promise<void>;
}