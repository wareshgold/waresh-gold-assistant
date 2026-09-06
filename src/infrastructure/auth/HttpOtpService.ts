import type { AuthenticatedCustomer } from "../../domain/auth/entities/AuthenticatedCustomer";
import type {
    OtpRequest,
    OtpRequestResult,
    OtpService,
    OtpVerification,
} from "../../domain/auth/providers/OtpService";

type OtpRequestInit = {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
};

type OtpHttpResponse = {
    ok: boolean;
    json(): Promise<unknown>;
};

export type OtpServiceHttpClient = (
    input: string,
    init?: OtpRequestInit,
) => Promise<OtpHttpResponse>;

export class HttpOtpService implements OtpService {
    constructor(
        private readonly baseUrl: string,
        private readonly client: OtpServiceHttpClient = fetch,
    ) {}

    async requestOtp(
        request: OtpRequest,
    ): Promise<OtpRequestResult> {
        return this.post<OtpRequestResult>("/api/v1/auth/request-otp", request);
    }

    async verifyOtp(
        verification: OtpVerification,
    ): Promise<AuthenticatedCustomer> {
        return this.post<AuthenticatedCustomer>("/api/v1/auth/verify-otp", verification);
    }

    private async post<T>(path: string, body: unknown): Promise<T> {
        const response = await this.client(`${this.baseUrl}${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            const message =
                data &&
                typeof data === "object" &&
                data !== null &&
                "error" in data &&
                typeof data.error === "string"
                    ? data.error
                    : "Authentication service request failed";

            throw new Error(message);
        }

        return data as T;
    }
}
