import type { ListAdminOrdersUseCase } from "../../../application/catalog/ListAdminOrdersUseCase";

export async function listAdminOrdersRoute(
    listAdminOrdersUseCase: ListAdminOrdersUseCase,
): Promise<Response> {
    try {
        const orders = await listAdminOrdersUseCase.execute();
        return Response.json({ orders }, {
            status: 200,
            headers: { "Cache-Control": "no-store" },
        });
    } catch {
        return Response.json({ error: "دریافت سفارش‌ها انجام نشد." }, {
            status: 500,
            headers: { "Cache-Control": "no-store" },
        });
    }
}
