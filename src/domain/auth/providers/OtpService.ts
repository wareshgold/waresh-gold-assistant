import type { AuthenticatedCustomer } from "../entities/AuthenticatedCustomer";

export type OtpPurpose =
    | "login"
    | "register"
    | "change-phone";

export type OtpRequest = {
    phone: string;
    purpose: OtpPurpose;
};

export type OtpRequestResult = {
    requestId: string;
    expiresAt: string;
    retryAfterSeconds: number;
};

export type OtpVerification = {
    requestId: string;
    phone: string;
    code: string;
    purpose: OtpPurpose;
};

export interface OtpService {
    requestOtp(
        request: OtpRequest,
    ): Promise<OtpRequestResult>;

    verifyOtp(
        verification: OtpVerification,
    ): Promise<AuthenticatedCustomer>;
}
