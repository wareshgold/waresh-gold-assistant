import type { VerifyPaymentUseCase } from "../../../application/payment/VerifyPaymentUseCase";

export async function verifyPaymentRoute(
    request: Request,
    useCase: VerifyPaymentUseCase,
    paymentId: string,
): Promise<Response> {
    const body = await request.json().catch(() => null) as { authority?: unknown } | null;
    const authority = typeof body?.authority === "string" ? body.authority : "";

    try {
        const payment = await useCase.execute({ paymentId, authority });
        return Response.json({ payment }, {
            status: 200,
            headers: { "Cache-Control": "no-store" },
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "تأیید پرداخت انجام نشد.";
        const status = message.includes("پیدا نشد") ? 404 : 400;
        return Response.json({ error: message }, {
            status,
            headers: { "Cache-Control": "no-store" },
        });
    }
}
