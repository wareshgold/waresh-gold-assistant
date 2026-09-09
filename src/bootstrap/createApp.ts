import { Hono } from "hono";

import { createRequestLogger } from "../shared/middleware/requestLogger";
import { createRequestContext } from "../shared/middleware/requestContext";
import { errorHandler } from "../presentation/middleware/errorHandler";
import { TelegramWebhookController } from "../interfaces/telegram/TelegramWebhookController";
import { SystemMetricsController } from "../interfaces/http/SystemMetricsController";
import { CatalogController } from "../interfaces/http/CatalogController";
import { MarketPriceProvider } from "../domain/market/providers/MarketPriceProvider";
import { MarketSnapshotService } from "../application/market/services/MarketSnapshotService";
import { GetGoldBubbleDataUseCase } from "../application/market/GetGoldBubbleDataUseCase";
import { SystemMonitoringService } from "../application/system/observability/SystemMonitoringService";
import { HealthCheckService } from "../application/system/HealthCheckService";
import { CalculateGoldPriceUseCase } from "../application/gold/CalculateGoldPriceUseCase";
import { RegisterCustomerUseCase } from "../application/auth/RegisterCustomerUseCase";
import { LoginCustomerUseCase } from "../application/auth/LoginCustomerUseCase";
import { CreateOrderQuoteUseCase, type OrderQuoteItemInput } from "../application/catalog/CreateOrderQuoteUseCase";
import { GetOrderQuoteUseCase } from "../application/catalog/GetOrderQuoteUseCase";
import { CreateOrderFromQuoteUseCase } from "../application/catalog/CreateOrderFromQuoteUseCase";
import { GetOrderUseCase } from "../application/catalog/GetOrderUseCase";
import { ListCustomerOrdersUseCase } from "../application/catalog/ListCustomerOrdersUseCase";
import { AddCustomerAddressUseCase } from "../application/customer/AddCustomerAddressUseCase";
import { RemoveCustomerAddressUseCase } from "../application/customer/RemoveCustomerAddressUseCase";
import { getOrderRoute } from "../interfaces/http/routes/GetOrderRoute";
import { listCustomerOrdersRoute } from "../interfaces/http/routes/ListCustomerOrdersRoute";
import type { CustomerRepository } from "../domain/customer/repositories/CustomerRepository";
import type { SessionService } from "../domain/auth/providers/SessionService";
import type { GetProductsUseCase } from "../application/catalog/GetProductsUseCase";
import type { GetProductUseCase } from "../application/catalog/GetProductUseCase";

interface AppContainer {
  telegramWebhookController: TelegramWebhookController;
  systemMetricsController: SystemMetricsController;
  monitoringService: SystemMonitoringService;
  healthCheckService: HealthCheckService;
  calculateGoldPriceUseCase: CalculateGoldPriceUseCase;
  createOrderQuoteUseCase: CreateOrderQuoteUseCase;
  getOrderQuoteUseCase: GetOrderQuoteUseCase;
  createOrderFromQuoteUseCase: CreateOrderFromQuoteUseCase;
  getOrderUseCase: GetOrderUseCase;
  listCustomerOrdersUseCase: ListCustomerOrdersUseCase;
  marketProvider: MarketPriceProvider;
  snapshotService: MarketSnapshotService;
  getGoldBubbleDataUseCase: GetGoldBubbleDataUseCase;
  registerCustomerUseCase: RegisterCustomerUseCase;
  loginCustomerUseCase: LoginCustomerUseCase;
  addCustomerAddressUseCase: AddCustomerAddressUseCase;
  removeCustomerAddressUseCase: RemoveCustomerAddressUseCase;
  customerRepository: CustomerRepository;
  sessionService: SessionService;
  getProductsUseCase: GetProductsUseCase;
  getProductUseCase: GetProductUseCase;
}

const jsonBody = async (c: any): Promise<Record<string, unknown> | null> => {
  const body = await c.req.json().catch(() => null);
  return body && typeof body === "object" && !Array.isArray(body) ? body as Record<string, unknown> : null;
};

const publicCustomer = (customer: any) => ({
  customerId: customer.customerId,
  username: customer.username,
  phone: customer.phone,
  nationalId: customer.nationalId,
  firstName: customer.firstName,
  lastName: customer.lastName,
});

export function createApp(container: AppContainer) {
  const app = new Hono();
  const catalogController = new CatalogController(container.getProductsUseCase, container.getProductUseCase);

  app.use("*", createRequestContext());
  app.use("*", createRequestLogger(container.monitoringService));
  app.onError(errorHandler);

  app.get("/health", async (c) => {
    const health = await container.healthCheckService.execute();
    return c.json({ service: "waresh-gold-assistant", version: "0.1.0", ...health });
  });

  app.get("/system/metrics", async (c) => c.json(await container.systemMetricsController.handle()));

  const marketPriceHandler = async (c: any) => {
    const price = await container.marketProvider.getCurrentPrice();
    return c.json({ gold18Price: price.gold18Price, currencyPrice: price.currencyPrice, ouncePrice: price.ouncePrice, updatedAt: price.updatedAt });
  };

  app.get("/market/gold-price", marketPriceHandler);
  app.get("/api/v1/market/gold-price", marketPriceHandler);

  app.get("/market/gold-bubble", async (c) => {
    const bubble = await container.getGoldBubbleDataUseCase.execute();
    return c.json({ marketPrice: bubble.marketPrice, intrinsicPrice: bubble.intrinsicPrice, bubbleAmount: bubble.bubbleAmount, bubblePercentage: bubble.bubblePercentage, updatedAt: bubble.updatedAt });
  });

  app.get("/market/history", async (c) => {
    const limit = Number(c.req.query("limit") ?? 50);
    return c.json({ items: await container.snapshotService.getHistory(limit) });
  });

  app.get("/api/v1/catalog/products", async (c) => c.json({ items: await catalogController.list() }));
  app.get("/api/v1/catalog/products/:productId", async (c) => {
    const product = await catalogController.get(c.req.param("productId"));
    return product ? c.json({ product }) : c.json({ error: "محصول پیدا نشد." }, 404);
  });

  app.post("/api/v1/checkout/quote", async (c) => {
    const body = await jsonBody(c);
    if (!body || !Array.isArray(body.items)) return c.json({ error: "اقلام سفارش معتبر نیستند." }, 400);
    const items: OrderQuoteItemInput[] = body.items.map((item) => {
      const candidate = item && typeof item === "object" ? item as Record<string, unknown> : {};
      return { productId: typeof candidate.productId === "string" || typeof candidate.productId === "number" ? String(candidate.productId) : "", variantId: typeof candidate.variantId === "string" ? candidate.variantId : "", quantity: typeof candidate.quantity === "string" || typeof candidate.quantity === "number" ? Number(candidate.quantity) : NaN };
    });
    try { return c.json({ quote: await container.createOrderQuoteUseCase.execute(items) }); }
    catch (error) { return c.json({ error: error instanceof Error ? error.message : "آماده‌سازی سفارش انجام نشد." }, 400); }
  });

  app.get("/api/v1/checkout/quote/:quoteId", async (c) => {
    try {
      const quote = await container.getOrderQuoteUseCase.execute(c.req.param("quoteId"));
      return quote ? c.json({ quote }, 200, { "Cache-Control": "no-store" }) : c.json({ error: "پیش‌فاکتور پیدا نشد." }, 404, { "Cache-Control": "no-store" });
    } catch (error) { return c.json({ error: error instanceof Error ? error.message : "دریافت پیش‌فاکتور انجام نشد." }, 400, { "Cache-Control": "no-store" }); }
  });

  const getAuthenticatedCustomerId = async (c: any): Promise<string | null> => {
    const sessionId = c.req.header("X-Customer-Session")?.trim();
    if (!sessionId) return null;
    const session = await container.sessionService.get(sessionId);
    return session?.customerId ?? null;
  };

  app.post("/api/v1/orders/from-quote", async (c) => {
    const body = await jsonBody(c);
    if (!body || typeof body.quoteId !== "string") return c.json({ error: "شناسه پیش‌فاکتور الزامی است." }, 400);

    const sessionId = c.req.header("X-Customer-Session")?.trim();
    if (!sessionId) return c.json({ error: "احراز هویت لازم است." }, 401);

    const session = await container.sessionService.get(sessionId);
    if (!session) return c.json({ error: "نشست کاربری معتبر نیست." }, 401);

    const addressId = typeof body.addressId === "string" ? body.addressId.trim() : undefined;
    try {
      const order = await container.createOrderFromQuoteUseCase.execute({ quoteId: body.quoteId, customerId: session.customerId, ...(addressId ? { addressId } : {}) });
      return c.json({ order }, 200, { "Cache-Control": "no-store" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "ثبت سفارش انجام نشد.";
      const status = message.includes("پیدا نشد") ? 404 : message.includes("دیگری") ? 409 : 400;
      return c.json({ error: message }, status, { "Cache-Control": "no-store" });
    }
  });

  app.get("/api/v1/orders/:orderId", async (c) => {
    const sessionId = c.req.header("X-Customer-Session")?.trim();
    let customerId: string | undefined;
    if (sessionId) {
      const session = await container.sessionService.get(sessionId);
      if (!session) return c.json({ error: "نشست کاربری معتبر نیست." }, 401, { "Cache-Control": "no-store" });
      customerId = session.customerId;
    }
    return getOrderRoute(c.req.raw, container.getOrderUseCase, c.req.param("orderId"), customerId);
  });

  app.get("/api/v1/orders", async (c) => {
    const sessionId = c.req.header("X-Customer-Session")?.trim();
    if (!sessionId) return c.json({ error: "احراز هویت لازم است." }, 401, { "Cache-Control": "no-store" });
    const session = await container.sessionService.get(sessionId);
    if (!session) return c.json({ error: "نشست کاربری معتبر نیست." }, 401, { "Cache-Control": "no-store" });
    return listCustomerOrdersRoute(container.listCustomerOrdersUseCase, session.customerId);
  });

  app.post("/api/v1/calculate/gold-price", async (c) => {
    const body = await jsonBody(c);
    if (!body) return c.json({ error: "درخواست نامعتبر است." }, 400);
    const numberField = (value: unknown): number | null => { const num = typeof value === "string" ? Number(value) : value; return typeof num === "number" && Number.isFinite(num) ? num : null; };
    const optionalNumberField = (value: unknown): number | null => value === undefined || value === null || value === "" ? 0 : numberField(value);
    const weight = numberField(body.weight), goldPrice = numberField(body.goldPrice), laborPercent = optionalNumberField(body.laborPercent), profitPercent = optionalNumberField(body.profitPercent), taxPercent = optionalNumberField(body.taxPercent);
    if (weight === null || goldPrice === null || laborPercent === null || profitPercent === null || taxPercent === null || weight <= 0 || goldPrice <= 0 || laborPercent < 0 || profitPercent < 0 || taxPercent < 0) return c.json({ error: "مقادیر ورودی معتبر نیستند." }, 400);
    let discount: number | undefined;
    if (body.discount !== undefined && body.discount !== null && body.discount !== "") { const parsed = numberField(body.discount); if (parsed === null || parsed < 0) return c.json({ error: "مقادیر ورودی معتبر نیستند." }, 400); discount = parsed; }
    const result = container.calculateGoldPriceUseCase.execute({ weight, goldPrice, laborPercent, profitPercent, taxPercent, ...(discount !== undefined ? { discount } : {}) });
    return c.json({ total: result.total });
  });

  app.post("/api/v1/auth/register", async (c) => {
    const body = await jsonBody(c);
    if (!body || typeof body.username !== "string" || typeof body.password !== "string" || typeof body.phone !== "string" || typeof body.nationalId !== "string") return c.json({ error: "اطلاعات ثبت‌نام کامل نیست." }, 400);
    try {
      const result = await container.registerCustomerUseCase.execute({ username: body.username, password: body.password, phone: body.phone, nationalId: body.nationalId, firstName: typeof body.firstName === "string" ? body.firstName : "", lastName: typeof body.lastName === "string" ? body.lastName : "" });
      return c.json({ customer: publicCustomer(result), sessionId: result.session.sessionId, expiresAt: result.session.expiresAt }, 201);
    } catch (error) { const message = error instanceof Error ? error.message : "ثبت‌نام انجام نشد."; return c.json({ error: message }, message.includes("قبلاً ثبت") ? 409 : 400); }
  });

  app.post("/api/v1/auth/login", async (c) => {
    const body = await jsonBody(c);
    if (!body || typeof body.username !== "string" || typeof body.password !== "string") return c.json({ error: "نام کاربری و رمز عبور الزامی است." }, 400);
    try { const result = await container.loginCustomerUseCase.execute(body.username, body.password); return c.json({ customer: publicCustomer(result), sessionId: result.session.sessionId, expiresAt: result.session.expiresAt }); }
    catch { return c.json({ error: "نام کاربری یا رمز عبور نادرست است." }, 401); }
  });

  app.get("/api/v1/auth/me", async (c) => {
    const sessionId = c.req.header("X-Customer-Session")?.trim();
    if (!sessionId) return c.json({ error: "احراز هویت لازم است." }, 401);
    const session = await container.sessionService.get(sessionId);
    if (!session) return c.json({ error: "نشست کاربری معتبر نیست." }, 401);
    const customer = await container.customerRepository.findById(session.customerId);
    if (!customer) return c.json({ error: "حساب کاربری پیدا نشد." }, 401);
    const addresses = await container.customerRepository.listAddresses(customer.customerId);
    return c.json({ customer: { ...publicCustomer(customer), addresses } });
  });

  app.get("/api/v1/account/addresses", async (c) => {
    const customerId = await getAuthenticatedCustomerId(c);
    if (!customerId) return c.json({ error: "احراز هویت لازم است." }, 401);
    return c.json({ addresses: await container.customerRepository.listAddresses(customerId) });
  });

  app.post("/api/v1/account/addresses", async (c) => {
    const customerId = await getAuthenticatedCustomerId(c);
    if (!customerId) return c.json({ error: "احراز هویت لازم است." }, 401);
    const body = await jsonBody(c);
    const fields = ["title", "recipientName", "phone", "province", "city", "address", "postalCode"] as const;
    if (!body || fields.some((field) => typeof body[field] !== "string" || !(body[field] as string).trim())) return c.json({ error: "اطلاعات آدرس کامل نیست." }, 400);
    try {
      const address = await container.addCustomerAddressUseCase.execute({ customerId, title: body.title as string, recipientName: body.recipientName as string, phone: body.phone as string, province: body.province as string, city: body.city as string, address: body.address as string, postalCode: body.postalCode as string });
      return c.json({ address }, 201);
    } catch (error) { return c.json({ error: error instanceof Error ? error.message : "ثبت آدرس انجام نشد." }, 400); }
  });

  app.delete("/api/v1/account/addresses/:addressId", async (c) => {
    const customerId = await getAuthenticatedCustomerId(c);
    if (!customerId) return c.json({ error: "احراز هویت لازم است." }, 401);
    try {
      await container.removeCustomerAddressUseCase.execute({ customerId, addressId: c.req.param("addressId") });
      return c.json({ ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "حذف آدرس انجام نشد.";
      return c.json({ error: message }, message === "Customer address not found" ? 404 : 400);
    }
  });

  app.post("/api/v1/auth/logout", async (c) => { const sessionId = c.req.header("X-Customer-Session")?.trim(); if (sessionId) await container.sessionService.revoke(sessionId); return c.json({ ok: true }); });
  app.all("/api/v1/auth/request-otp", (c) => c.json({ error: "OTP فعلاً غیرفعال است." }, 410));
  app.all("/api/v1/auth/verify-otp", (c) => c.json({ error: "OTP فعلاً غیرفعال است." }, 410));

  app.get("/api/v1/strategy-a/status", async (c) => {
    try {
      const db = (container as any).waresh_gold_db;
      if (!db) return c.json({ error: "D1 database not available" });
      const sixHoursAgo = Date.now() - 6 * 60 * 60 * 1000, oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      const ticks6h = await db.prepare("SELECT COUNT(*) as count FROM ounce_ticks WHERE timestamp >= ?").bind(sixHoursAgo).first();
      const ticks24h = await db.prepare("SELECT COUNT(*) as count FROM ounce_ticks WHERE timestamp >= ?").bind(oneDayAgo).first();
      const lastTick = await db.prepare("SELECT price, direction, timestamp FROM ounce_ticks ORDER BY timestamp DESC LIMIT 1").first();
      const signals = await db.prepare("SELECT COUNT(*) as count FROM strategy_a_signals").first();
      const lastSignal = await db.prepare("SELECT signal_type, reason, entry_price, generated_at FROM strategy_a_signals ORDER BY generated_at DESC LIMIT 1").first();
      return c.json({ ticks: { last6h: ticks6h?.count ?? 0, last24h: ticks24h?.count ?? 0, lastTick: lastTick ? { price: lastTick.price, direction: lastTick.direction, time: new Date(lastTick.timestamp).toISOString() } : null }, signals: { total: signals?.count ?? 0, last: lastSignal ? { type: lastSignal.signal_type, reason: lastSignal.reason, entryPrice: lastSignal.entry_price, time: new Date(lastSignal.generated_at).toISOString() } : null }, dataCollection: { hasEnoughData: (ticks6h?.count ?? 0) >= 12, status: (ticks6h?.count ?? 0) >= 12 ? "healthy" : "insufficient" } });
    } catch (error) { return c.json({ error: String(error) }, 500); }
  });

  app.get("/api/v1/strategy-a/debug", async (c) => {
    try {
      const db = (container as any).waresh_gold_db;
      if (!db) return c.json({ error: "D1 database not available" });
      const ticks = await db.prepare("SELECT price, direction, timestamp FROM ounce_ticks ORDER BY timestamp DESC LIMIT 30").all();
      if (!ticks.results || ticks.results.length === 0) return c.json({ error: "No ticks found" });
      const bucketMs = 5 * 60 * 1000;
      const buckets = new Map();
      const sortedTicks = ticks.results.reverse().map((t: any) => ({ price: Number(t.price), direction: t.direction, timestamp: Number(t.timestamp) }));
      for (const tick of sortedTicks) { const bucketStart = Math.floor(tick.timestamp / bucketMs) * bucketMs; if (!buckets.has(bucketStart)) buckets.set(bucketStart, []); buckets.get(bucketStart).push(tick); }
      const candles = [...buckets.entries()].sort((a, b) => a[0] - b[0]).map(([ts, bucket]) => { const prices = bucket.map((t: any) => t.price); return { timestamp: new Date(ts).toISOString(), open: prices[0], high: Math.max(...prices), low: Math.min(...prices), close: prices[prices.length - 1], volume: prices.length }; });
      const last5 = candles.slice(-5);
      const avgRange = last5.reduce((s, c) => s + (c.high - c.low), 0) / last5.length;
      const analysis = last5.map((candle, i) => { const range = candle.high - candle.low, body = Math.abs(candle.close - candle.open), bodyRatio = range > 0 ? body / range : 0, isBullish = candle.close > candle.open, isStrong = bodyRatio >= 0.65; let gapInfo = "N/A (first candle)"; if (i > 0) { const prev = last5[i - 1]; gapInfo = `BUY gap: ${(candle.low - prev.high).toFixed(2)}, SELL gap: ${(prev.low - candle.high).toFixed(2)}`; } return { time: candle.timestamp, O: candle.open, H: candle.high, L: candle.low, C: candle.close, range: range.toFixed(2), body: body.toFixed(2), bodyRatio: (bodyRatio * 100).toFixed(1) + "%", direction: isBullish ? "BULL" : "BEAR", isStrong: isStrong ? "✅" : `❌ (${(bodyRatio * 100).toFixed(1)}% < 65%)`, gap: i > 0 ? gapInfo : "N/A" }; });
      const reasons: string[] = [];
      const strongCandles = last5.filter(c => { const range = c.high - c.low, body = Math.abs(c.close - c.open); return range > 0 && (body / range) >= 0.65; });
      if (strongCandles.length < 3) reasons.push(`Only ${strongCandles.length}/5 candles have 65%+ body ratio`);
      let hasAnyGap = false;
      for (let i = 1; i < last5.length; i++) { const prev = last5[i - 1], curr = last5[i]; if (curr.low > prev.high || curr.high < prev.low) { hasAnyGap = true; break; } }
      if (!hasAnyGap) reasons.push("No P-Gap found between consecutive candles (all overlap)");
      return c.json({ candleCount: candles.length, avgRange: avgRange.toFixed(2), last5Candles: analysis, rejectionReasons: reasons, config: { minBodyRatio: "65%", minSpikeCandles: 3, minSpikeMovePercent: "0.12%", minGapRatio: "15% of avg range", pGapRequired: "YES (mandatory)" } });
    } catch (error) { return c.json({ error: String(error) }, 500); }
  });

  app.post("/telegram/webhook", async (c) => container.telegramWebhookController.handle(c));
  return app;
}
