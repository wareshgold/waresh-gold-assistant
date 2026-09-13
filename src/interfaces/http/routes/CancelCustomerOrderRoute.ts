import type { CancelCustomerOrderUseCase } from "../../../application/catalog/CancelCustomerOrderUseCase";

export async function cancelCustomerOrderRoute(
    useCase: CancelCustomerOrderUseCase,
    orderId: string,
    customerId: string,
): Promise<Response> {
    try {
        const order = await useCase.execute({ orderId, customerId });
        return Response.json({ order }, { status: 200, headers: { "Cache-Control": "no-store" } });
    } catch (error) {
        const message = error instanceof Error ? error.message : "لغو سفارش انجام نشد.";
        const status = message === "سفارش پیدا نشد." ? 404
            : message === "دسترسی به این سفارش مجاز نیست." ? 403
            : message.includes("مجاز نیست") ? 409
            : message.includes("در حین لغو") ? 409
            : 400;
        return Response.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
    }
}
