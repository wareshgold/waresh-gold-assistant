import {
    VIPAccessService,
    ActivateVIPResult
} from "./VIPAccessService";

export interface ActivateVIPCodeInput {
    telegramUserId: string;
    code: string;
}

export class ActivateVIPCodeUseCase {

    constructor(
        private readonly vipAccessService: VIPAccessService
    ) {}

    async execute(
        input: ActivateVIPCodeInput
    ): Promise<ActivateVIPResult> {
        const telegramUserId =
            input.telegramUserId.trim();

        const code =
            input.code.trim();

        if (!telegramUserId || !code) {
            return {
                success: false,
                reason: "INVALID_CODE"
            };
        }

        return this.vipAccessService.activateCode(
            telegramUserId,
            code
        );
    }
}
