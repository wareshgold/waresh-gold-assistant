import type { GetOrderUseCase } from "../../../application/catalog/GetOrderUseCase";

export async function getAdminOrderRoute(
    useCase: GetOrderUseCase,
    orderId: string,
): Promise<Response> {
    const normalizedOrderId = orderId.trim();
    if (!normalizedOrderId) {
        return Response.json({ error: "شناسه سفارش الزامی است." }, { status: 400 });
    }

    try {
        const details = await useCase.executeAdminWithHistory({ orderId: normalizedOrderId });
        if (!details) {
            return Response.json({ error: "سفارش پیدا نشد." }, { status: 404 });
        }
        return Response.json(details, { status: 200, headers: { "Cache-Control": "no-store" } });
    } catch (error) {
        return Response.json(
            { error: error instanceof Error ? error.message : "دریافت سفارش انجام نشد." },
            { status: 400, headers: { "Cache-Control": "no-store" } },
        );
    }
}
