import type { GetOrderUseCase } from "../../../application/catalog/GetOrderUseCase";

export async function getOrderRoute(request: Request, getOrderUseCase: GetOrderUseCase, orderId: string): Promise<Response> {
  try {
    const order = await getOrderUseCase.execute({ orderId });

    if (!order) {
      return Response.json({ error: "سفارش پیدا نشد." }, {
        status: 404,
        headers: { "Cache-Control": "no-store" },
      });
    }

    return Response.json({ order }, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json({ error: "شناسه سفارش نامعتبر است." }, {
      status: 400,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
