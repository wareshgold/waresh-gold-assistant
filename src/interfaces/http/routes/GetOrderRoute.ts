import type { GetOrderUseCase } from "../../../application/catalog/GetOrderUseCase";

export async function getOrderRoute(
  _request: Request,
  getOrderUseCase: GetOrderUseCase,
  orderId: string,
  customerId?: string,
): Promise<Response> {
  try {
    const normalizedCustomerId = customerId?.trim();
    if (!normalizedCustomerId) {
      return Response.json({ error: "احراز هویت لازم است." }, {
        status: 401,
        headers: { "Cache-Control": "no-store" },
      });
    }

    const details = await getOrderUseCase.executeWithHistory({
      orderId,
      customerId: normalizedCustomerId,
    });

    if (!details) {
      return Response.json({ error: "سفارش پیدا نشد." }, {
        status: 404,
        headers: { "Cache-Control": "no-store" },
      });
    }

    return Response.json(details, {
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
