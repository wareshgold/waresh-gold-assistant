import type { AddWishlistItemUseCase } from "../../../application/customer/AddWishlistItemUseCase";
import type { ListWishlistUseCase } from "../../../application/customer/ListWishlistUseCase";
import type { RemoveWishlistItemUseCase } from "../../../application/customer/RemoveWishlistItemUseCase";

export async function listWishlistRoute(useCase: ListWishlistUseCase, customerId: string): Promise<Response> {
    try {
        const items = await useCase.execute(customerId);
        return Response.json({ items }, { status: 200, headers: { "Cache-Control": "no-store" } });
    } catch (error) {
        return Response.json({ error: error instanceof Error ? error.message : "دریافت علاقه‌مندی‌ها انجام نشد." }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }
}

export async function addWishlistItemRoute(useCase: AddWishlistItemUseCase, customerId: string, productId: string): Promise<Response> {
    try {
        const item = await useCase.execute({ customerId, productId });
        return Response.json({ item }, { status: 201, headers: { "Cache-Control": "no-store" } });
    } catch (error) {
        const message = error instanceof Error ? error.message : "افزودن به علاقه‌مندی‌ها انجام نشد.";
        return Response.json({ error: message }, { status: message === "محصول پیدا نشد." ? 404 : 400, headers: { "Cache-Control": "no-store" } });
    }
}

export async function removeWishlistItemRoute(useCase: RemoveWishlistItemUseCase, customerId: string, productId: string): Promise<Response> {
    try {
        await useCase.execute({ customerId, productId });
        return Response.json({ ok: true }, { status: 200, headers: { "Cache-Control": "no-store" } });
    } catch (error) {
        const message = error instanceof Error ? error.message : "حذف از علاقه‌مندی‌ها انجام نشد.";
        return Response.json({ error: message }, { status: message === "محصول پیدا نشد." ? 404 : 400, headers: { "Cache-Control": "no-store" } });
    }
}
