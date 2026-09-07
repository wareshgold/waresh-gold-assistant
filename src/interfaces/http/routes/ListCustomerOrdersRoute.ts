import type { ListCustomerOrdersUseCase } from "../../../application/catalog/ListCustomerOrdersUseCase";

export async function listCustomerOrdersRoute(
    getCustomerOrdersUseCase: ListCustomerOrdersUseCase,
    customerId: string,
): Promise<Response> {
    try {
        const orders = await getCustomerOrdersUseCase.execute({ customerId });
        return Response.json({ orders }, {
            status: 200,
            headers: { "Cache-Control": "no-store" },
        });
    } catch {
        return Response.json({ error: "دریافت سفارش‌ها انجام نشد." }, {
            status: 400,
            headers: { "Cache-Control": "no-store" },
        });
    }
}
