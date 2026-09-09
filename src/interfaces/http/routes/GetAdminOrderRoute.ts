import type { GetAdminOrderUseCase } from "../../../application/catalog/GetAdminOrderUseCase";

export async function getAdminOrderRoute(
    useCase: GetAdminOrderUseCase,
    orderId: string,
): Promise<Response> {
    const normalizedOrderId = orderId.trim();
    if (!normalizedOrderId) {
        return Response.json({ error: "شناسه سفارش الزامی است." }, { status: 400 });
    }

    try {
        const order = await useCase.execute({ orderId: normalizedOrderId });
        if (!order) {
            return Response.json({ error: "سفارش پیدا نشد." }, { status: 404 });
        }
        return Response.json({ order }, { status: 200, headers: { "Cache-Control": "no-store" } });
    } catch (error) {
        return Response.json(
            { error: error instanceof Error ? error.message : "دریافت سفارش انجام نشد." },
            { status: 400, headers: { "Cache-Control": "no-store" } },
        );
    }
}
