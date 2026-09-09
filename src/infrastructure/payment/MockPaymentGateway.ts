import type { PaymentGateway, PaymentInitiation, PaymentVerification } from "../../domain/payment/gateways/PaymentGateway";

export class MockPaymentGateway implements PaymentGateway {
    readonly name = "mock";

    async initiate(input: { paymentId: string; orderId: string; amount: number }): Promise<PaymentInitiation> {
        return {
            authority: `MOCK-${input.paymentId}`,
            paymentUrl: `/checkout/payment/mock?paymentId=${encodeURIComponent(input.paymentId)}&orderId=${encodeURIComponent(input.orderId)}&amount=${encodeURIComponent(String(input.amount))}`,
        };
    }

    async verify(input: { paymentId: string; authority: string; amount: number }): Promise<PaymentVerification> {
        if (!input.authority || input.amount <= 0 || !input.paymentId) throw new Error("تأیید پرداخت نامعتبر است.");
        return { referenceId: `MOCK-REF-${input.paymentId}` };
    }
}
