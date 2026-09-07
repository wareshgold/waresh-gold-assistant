import type { ProductRepository } from "../../domain/catalog/repositories/ProductRepository";
import type { OrderQuoteRepository } from "../../domain/catalog/repositories/OrderQuoteRepository";
import type { OrderQuote } from "../../domain/catalog/entities/OrderQuote";
import type { MarketPriceProvider } from "../../domain/market/providers/MarketPriceProvider";
import type { CalculateGoldPriceUseCase } from "../gold/CalculateGoldPriceUseCase";

export interface OrderQuoteItemInput {
    productId: string;
    variantId: string;
    quantity: number;
}

export class CreateOrderQuoteUseCase {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly marketPriceProvider: MarketPriceProvider,
        private readonly calculateGoldPriceUseCase: CalculateGoldPriceUseCase,
        private readonly orderQuoteRepository: OrderQuoteRepository,
    ) {}

    async execute(items: readonly OrderQuoteItemInput[]): Promise<OrderQuote> {
        if (!items.length) {
            throw new Error("سبد سفارش خالی است.");
        }

        const normalizedItems = items.map((item) => ({
            productId: String(item.productId).trim(),
            variantId: String(item.variantId).trim() || "default-standard",
            quantity: Number(item.quantity),
        }));

        for (const item of normalizedItems) {
            if (!item.productId || !Number.isInteger(item.quantity) || item.quantity <= 0 || item.quantity > 100) {
                throw new Error("اطلاعات سفارش معتبر نیست.");
            }
        }

        const [market, products] = await Promise.all([
            this.marketPriceProvider.getCurrentPrice(),
            Promise.all(normalizedItems.map((item) => this.productRepository.findById(item.productId))),
        ]);

        const lines: OrderQuote["items"] = [];

        for (let index = 0; index < normalizedItems.length; index += 1) {
            const item = normalizedItems[index];
            const product = products[index];

            if (!product || !product.active) {
                throw new Error(`محصول ${item.productId} پیدا نشد.`);
            }

            if (product.stockStatus === "out-of-stock") {
                throw new Error(`محصول «${product.name}» در حال حاضر موجود نیست.`);
            }

            if (product.karat !== 18) {
                throw new Error(`قیمت‌گذاری محصول «${product.name}» با عیار ${product.karat} فعلاً پشتیبانی نمی‌شود.`);
            }

            const calculation = this.calculateGoldPriceUseCase.execute({
                weight: product.weightGrams,
                goldPrice: market.gold18Price,
                laborPercent: product.laborPercent,
                profitPercent: product.profitPercent,
                taxPercent: product.taxPercent,
            });

            lines.push({
                productId: product.productId,
                variantId: item.variantId,
                sku: product.sku,
                name: product.name,
                quantity: item.quantity,
                weightGrams: product.weightGrams,
                unitPrice: calculation.total,
                lineTotal: calculation.total * item.quantity,
            });
        }

        const quote: OrderQuote = {
            quoteId: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            market: {
                gold18Price: market.gold18Price,
                currencyPrice: market.currencyPrice,
                ouncePrice: market.ouncePrice,
                updatedAt: market.updatedAt.toISOString(),
            },
            items: lines,
            total: lines.reduce((sum, line) => sum + line.lineTotal, 0),
        };

        await this.orderQuoteRepository.save(quote);
        return quote;
    }
}
