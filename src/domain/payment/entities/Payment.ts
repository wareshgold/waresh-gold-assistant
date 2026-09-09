export type PaymentStatus =
    | "pending"
    | "initiated"
    | "paid"
    | "failed"
    | "cancelled"
    | "expired"
    | "refunded";

export type Payment = {
    paymentId: string;
    orderId: string;
    amount: number;
    status: PaymentStatus;
    gateway: string;
    authority: string | null;
    referenceId: string | null;
    createdAt: string;
    updatedAt: string;
};
