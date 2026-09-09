import type { OrderStatus } from "../../../domain/catalog/entities/Order";
import type { UpdateOrderStatusUseCase } from "../../../application/catalog/UpdateOrderStatusUseCase";

const ORDER_STATUSES: readonly OrderStatus[] = [
    "pending_confirmation",
    "confirmed",
    "paid",
    "processing",
    "completed",
    "cancelled",
    "expired",
];

function isOrderStatus(value: unknown): value is OrderStatus {
    return typeof value === "string" && ORDER_STATUSES.includes(value as OrderStatus);
}

export async function updateOrderStatusRoute(
    request: Request,
    useCase: UpdateOrderStatusUseCase,
    orderId: string,
): Promise<Response> {
    const normalizedOrderId = orderId.trim();
    if (!normalizedOrderId) {
        return Response.json({ error: "شناسه سفارش الزامی است." }, { status: 400 });
    }

    const body = await request.json().catch(() => null) as Record<string, unknown> | null;
    if (!body || !isOrderStatus(body.status)) {
        return Response.json({ error: "وضعیت سفارش معتبر نیست." }, { status: 400 });
    }

    try {
        const order = await useCase.execute({
            orderId: normalizedOrderId,
            status: body.status,
        });

        return Response.json(
            { order },
            {
                status: 200,
                headers: { "Cache-Control": "no-store" },
            },
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : "تغییر وضعیت سفارش انجام نشد.";
        const status = message === "سفارش پیدا نشد."
            ? 404
            : message.includes("مجاز نیست")
                ? 409
                : 400;

        return Response.json(
            { error: message },
            {
                status,
                headers: { "Cache-Control": "no-store" },
            },
        );
    }
}
