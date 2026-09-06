import type { AuthenticatedCustomer } from "../../domain/auth/entities/AuthenticatedCustomer";
import type {
    OtpService,
    OtpVerification,
} from "../../domain/auth/providers/OtpService";

export class VerifyOtpUseCase {
    constructor(
        private readonly otpService: OtpService,
    ) {}

    async execute(
        verification: OtpVerification,
    ): Promise<AuthenticatedCustomer> {
        return this.otpService.verifyOtp(verification);
    }
}
