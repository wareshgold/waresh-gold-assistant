import type {
    OtpRequest,
    OtpRequestResult,
    OtpService,
} from "../../domain/auth/providers/OtpService";

export class RequestOtpUseCase {
    constructor(
        private readonly otpService: OtpService,
    ) {}

    async execute(
        request: OtpRequest,
    ): Promise<OtpRequestResult> {
        return this.otpService.requestOtp(request);
    }
}
