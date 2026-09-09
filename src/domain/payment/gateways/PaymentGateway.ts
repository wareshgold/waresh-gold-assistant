export type PaymentInitiation = {
    authority: string;
    paymentUrl: string;
};

export type PaymentVerification = {
    referenceId: string;
};

export interface PaymentGateway {
    readonly name: string;
    initiate(input: { paymentId: string; orderId: string; amount: number }): Promise<PaymentInitiation>;
    verify(input: { paymentId: string; authority: string; amount: number }): Promise<PaymentVerification>;
}
