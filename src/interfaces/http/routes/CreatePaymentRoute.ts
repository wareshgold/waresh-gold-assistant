import type { CreatePaymentUseCase } from "../../../application/payment/CreatePaymentUseCase";

export async function createPaymentRoute(
    request: Request,
    useCase: CreatePaymentUseCase,
    customerId: string | null,
): Promise<Response> {
    if (!customerId) {
        return Response.json({ error: "احراز هویت لازم است." }, { status: 401, headers: { "Cache-Control": "no-store" } });
    }

    const body = await request.json().catch(() => null) as Record<string, unknown> | null;
    const orderId = typeof body?.orderId === "string" ? body.orderId.trim() : "";

    if (!orderId) {
        return Response.json({ error: "شناسه سفارش الزامی است." }, { status: 400 });
    }

    try {
        const result = await useCase.execute({ orderId, customerId });
        return Response.json(
            { payment: result.payment, paymentUrl: result.paymentUrl },
            { status: 201, headers: { "Cache-Control": "no-store" } },
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : "ایجاد پرداخت انجام نشد.";
        const status = message === "سفارش پیدا نشد."
            ? 404
            : message.includes("احراز هویت")
                ? 401
                : message.includes("متعلق به حساب")
                    ? 403
                    : message.includes("برای پرداخت آماده نیست") || message.includes("پرداخت فعال") || message.includes("قبلاً پرداخت")
                        ? 409
                        : 400;

        return Response.json(
            { error: message },
            { status, headers: { "Cache-Control": "no-store" } },
        );
    }
}
